const Promise = require('bluebird');
const path = require('path');
const config = require('../config');

const gene = require('./gene');
const Genes = require('../models/genes.model');
const ensembl = require('./ensembl');

const transvarPath = config.transvar.path;

const appendGene = (data) => {
  return new Promise((resolve, reject) => {
    Genes.findOne({ taxonId: 9606, symbol: data.gene }, { _id: 0, entrezId: 1, symbol: 1 })
      .then((geneDoc) => {
        data.gene = geneDoc;
        resolve(data);
      }).catch((err) => {
        console.log(err);
        data.gene = null;
        resolve(data);
      });
  });
}

const executeTransvar = (option) => {
  return new Promise((resolve, reject) => {
    const { spawn } = require('child_process');
    const proc = spawn(transvarPath, option);

    var stdout = '';
    var stderr = [];
    proc.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    // Err on subprocess (transvar)
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

    // Error on spawning
    proc.on('error', (err) => {
      reject(err);
    });
  });
};

const parseTransvarResultCoordinate = (coord) => {
  return new Promise((resolve, reject) => {
    const M = coord.match(/(chr(\d+|X|Y):g.(\d+)((?:A|C|G|T|U)+)?>?((?:(?:[a-z]+)?(?:A|C|G|T|U)+))|\.)\/((?:c\.(\d+(?:[-+_]\d+)?)((?:A|C|G|T|U)+)?)>?((?:[a-z]+)?(?:A|C|G|T|U)+)|\.)\/(p\.([A-Za-z]+)(\d+)([A-Za-z]+|\*)|\.)/);
    if (M == null) {
      reject('Invalid format');
    } else {
      resolve({
        gdna: {
          annot: M[1] === '.' ? null : M[1],
          chr: M[2] || null,
          pos: M[3] === undefined ? null : +M[3],
          ref: M[4] || null,
          alt: M[5] || null
        },
        cdna: {
          annot: M[6] === '.' ? null : M[6],
          chr: M[2] || null,
          pos: M[7] === undefined ? null : +M[7],
          ref: M[8] || null,
          alt: M[9] || null
        },
        protein: {
          annot: M[10] === '.' ? null : M[10],
          ref: M[11],
          pos: M[12] === undefined ? null : +M[12],
          alt: M[13]
        }
      });
    }
  });
};

const parseTransvarResult = (res) => {
  return new Promise((resolve, reject) => {
    const parsed = {
      code: res.code,
      errors: null,
      output: []
    };
    if (res.stderr && res.stderr.length > 0) {
      parsed.errors = [];
      for (var i = 0; i < res.stderr.length; ++i) {
        parsed.errors.push(res.stderr[i].toString().replace(/\[[^\[]+\]/, '').replace(/_/g, ' '));
      }
    }

    const lines = res.stdout.split(/\r?\n/);
    if (lines.length > 1) {
      parsed.output = lines.slice(1).filter((line) => (line || '').trim().length);
    }
    resolve(parsed);
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

exports.proteinToGenomicLocations = (protein, build) => {
  return new Promise((resolve, reject) => {
    build = build === 'hg38' ? build : 'hg19';
    executeTransvar(['panno', '--refversion', build, '-i', protein, '--ensembl', '--refseq']).bind({})
      .then((res) => {
        return parseTransvarResult(res);
      }).then((res) => {
        const candidates = {};
        for (const L of res.output) {
          const col = L.split('\t');
          const geneSymbol = (col[2] || '.').trim();
          let coord = (col[4] || '').split('/')[0];
          coord = coord === '.' ? null : coord;
          if (coord && geneSymbol !== '.') {
            // Put TransVar's choice
            putCandidate(candidates, geneSymbol, col[1].trim(), coord, 'snv');
          } else if (this.errors == null && col[6]) {
            this.errors = [ col[6].trim().replace(/_/g, ' ') ];
          }
        }
        return Object.keys(candidates).map((key) => {
          candidates[key].transcript = candidates[key].transcripts.filter((v, i, a) => a.indexOf(v) === i);
          return candidates[key];
        });
      }).filter((candidate) => {    // Remove this filter if also want to serve mnvs
        return candidate.type === 'snv';
      }).map(candidate => {
        return appendGene(candidate);
      }).filter((candidate) => {
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

exports.forwardAnnotationWithGdna = (identifier, build) => {
  return new Promise((resolve, reject) => {
    build = build === 'hg38' ? build : 'hg19';
    executeTransvar(['ganno', '--refversion', build, '-i', identifier, '--ensembl', '--refseq'])
      .bind({})
      .then((res) => {
        return parseTransvarResult(res);
      }).then((res) => {
        return res.output;
      }).map((line) => {
        // Get protein annotation & transcript IDs
        const col = line.split('\t');
        return parseTransvarResultCoordinate(col[4].trim())
          .then((coord) => {
            return {
              transcriptId: (col[1] || '').trim().split(' ')[0],
              coord: coord.protein,
              cdnaCoord: coord.cdna
            };
          }).catch((err) => {
            return null;
          });
      })
      .map((candidate) => {
        if (!candidate) return {};
        // Mark Ensembl canonical
        return ensembl.queryLookupByEnsemblId(candidate.transcriptId)
          .then((res) => {
            return ((res || {}).is_canonical) ? true : false;
          }).then((isCanonical) => {
            candidate.isCanonical = isCanonical;
            return candidate;
          }).catch((err) => {
            return candidate;
          });
      })
      .filter((candidate) => candidate.coord)
      .then((candidates) => {
        let canonical = undefined;
        const countAnnot = {};
        for (const cand of candidates) {
          if (!cand.transcriptId) continue;
          if (cand.isCanonical) {
            canonical = cand;
          }

          if (cand.transcriptId.slice(0, 4) === 'ENST') {
            countAnnot[cand.coord.annot] = 0;   // Prep to count the annotation from Ensembl result
          }
        }
        // If no canonical transcript exists, get the annotation most agreed on by RefSeq result
        let mostAgreed = undefined;
        if (!canonical) {
          let maxAgrees = -1;
          for (const cand of candidates) {
            if (!cand.transcriptId) continue;
            if (cand.transcriptId.slice(0, 4) !== 'ENST' && cand.coord.annot in countAnnot) {
              countAnnot[cand.coord.annot] += 1;
              if (maxAgrees < countAnnot[cand.coord.annot]) {
                mostAgreed = cand;
              }
            }
          }
        }

        resolve({
          canonical: canonical,
          mostAgreed: mostAgreed,
          candidates: candidates
        });
      }).catch((err) => {
        reject(err);
      });
  });
};
