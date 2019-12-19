const Promise = require('bluebird');
const path = require('path');
const config = require('../config');

const gene = require('./gene');

const transvarPath = config.transvar.path;

const appendGene = (data) => {
  return new Promise((resolve, reject) => {
    gene.getBySymbol(9606, data.gene)
      .then(geneDoc => {
        data.gene = geneDoc;
        resolve(data);
      }).catch(err => {
        data.gene = null;
        resolve(data);
      });
  });
}

const executeTransvar = (option) => {
  return new Promise((resolve, reject) => {
    const { spawn } = require('child_process');
    console.log(transvarPath, option);
    const proc = spawn(transvarPath, option);

    var stdout = '';
    var stderr = [];
    proc.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    proc.stderr.on('data', (err) => {
      stderr.push(err);
    });

    proc.on('close', (code) => {
      resolve({
        code: code,
        stdout: stdout,
        stderr: stderr
      });
    });
  });
};

const putCandidate = (candidates, gene, transcript, coord, varType) => {
  if (coord.indexOf('>') === -1) return;
  const M = transcript.match(/((?:ENST(?:\d)+|NM_(?:\d)+(?:\.\d+)?))\s*(?:\([^\)]+\))?/);
  if (!M) return;
  if (!(coord in candidates)) {
    candidates[coord] = {
      gene: gene,
      coord: coord,
      type: varType,
      transcripts: []
    };
  }
  candidates[coord].transcripts.push(M[1]);
}

exports.proteinToGenomicLocations = (protein) => {
  return new Promise((resolve, reject) => {
    executeTransvar(['panno', '-i', protein, '--ensembl', '--refseq']).bind({})
      .then((res) => {
        this.code = res.code;
        this.errors = null;
        if (res.stderr && res.stderr.length > 0) {
          this.errors = [];
          for (var i=0; i<res.stderr.length; ++i) {
            this.errors.push(res.stderr[i].toString().replace(/\[[^\[]+\]/, '').replace(/_/g, ' '));
          }
        }

        var L = res.stdout.split(/\r?\n/)
        if (L.length <= 1) {
          return [];
        }
        else {
          var candidates = {};
          for (var i=1; i<L.length; ++i) {
            var line = L[i].split('\t');
            if (line.length < 3) continue;

            var gene = line[2].trim();
            var coord = line[4].split('/')[0];
            var info = line[6].split(';');
            var transcript = line[1].trim();
            if (gene !== '.') {
              // Put TransVar's choice
              putCandidate(candidates, gene, transcript, coord, 'snv');

              // Put other candidates TransVar did not choose
              for (var j=0; j<info.length; ++j) {
                var S = info[j].split('=');
                if (S.length < 2) {
                  continue;
                }

                if (S[0] === 'candidate_snv_variants') {
                  var snvs = S[1].split(',');
                  for (var k=0; k<snvs.length; ++k) {
                    putCandidate(candidates, gene, transcript, snvs[k], 'snv');
                  }
                }

                /*
                if (S[0] === 'candidate_mnv_variants') {
                  var mnvs = S[1].split(',');
                  for (var k=0; k<mnvs.length; ++k) {
                    putCandidate(candidates, gene, transcript, mnvs[k], 'mnv');
                  }
                }
                */
              }
            } else if (this.errors == null) {
              this.errors = [ line[6].trim().replace(/_/g, ' ') ];
            }
          }

          return Object.keys(candidates).map((key) => {
            candidates[key].transcript = candidates[key].transcripts.filter((v, i, a) => a.indexOf(v) === i);
            return candidates[key];
          });
        }
      }).filter((candidate) => {    // Remove this filter if also want to serve mnvs
        return candidate.type === 'snv';
      }).map(candidate => {
        return appendGene(candidate);
      }).filter((candidate) => {    // Remove this filter if also want to serve mnvs
        return candidate.gene !== null;
      }).then((candidates) => {
        resolve({
          code: this.code,
          errors: this.errors,
          candidates: candidates
        });
      }).catch((err) => {
        console.log(err);
        reject(err);
      });
  });
}
