const Promise = require('bluebird');
const rp = require('request-promise');

const gene = require('./gene');

var validateAndParseVariantInput;

exports.getGeneByTranscript = (transcript) => {
  return new Promise((resolve, reject) => {
    if (!transcript.length) resolve(null);
    else {
      rp({
        method: 'GET',
        uri: 'https://mutalyzer.nl/json/getGeneName?build=hg19&accno=' + transcript,
        headers: { 'content-type': 'application/json' }
      }).then(str => {
        var geneSymbol = (JSON.parse(str) || '').trim();
        return gene.getBySymbol(9606, geneSymbol);
      }).then(doc => {
        resolve(doc);
      }).catch(err => {
        reject(err);
      });
    }
  });
};

exports.getGenomLocByHgvsVar = (variant) => {
  return new Promise((resolve, reject) => {
    rp({
      method: 'GET',
      uri: 'https://mutalyzer.nl/json/numberConversion?build=hg19&variant=' + encodeURIComponent(variant),
      headers: {
        'content-type': 'application/json'
      }
    }).then((str) => {
      var genomLoc = JSON.parse(str);
      if (genomLoc.length < 1 || genomLoc[0] == null) {
        rp({
          method: 'GET',
          uri: 'https://mutalyzer.nl/json/checkSyntax?variant=' + encodeURIComponent(variant),
          headers: {
            'content-type': 'application/json'
          }
        }).then(function (str) {
          var err = new Error('no mutalyzer res');
          err.mutalyzer = JSON.parse(str);
          err.variant = variant;
          console.log(err.mutalyzer);
          reject(err);
        }).catch(function (err) {
          var err = new Error('no mutalyzer res');
          reject(err);
        });
      }
      else {
        var variantParsed = validateAndParseVariantInput(genomLoc[0]);
        if (variantParsed === null) reject(new Error('Invalid variant input'));
        else resolve(variantParsed);
      }
    }).catch(function (err) {
      reject(err);
    });
  });
};

validateAndParseVariantInput = (varInput) => {
  const reExps = [
    /(?:chr|Chr)?([0-9]?[0-9XY])\s*:\s*([0-9]*)\s*([ACGT]*)\s*>\s*([ACGT]*)/,
    /([0-9]?[0-9XY])\s*-\s*([0-9]*)\s*-\s*([ACGT]*)\s*-\s*([ACGT]*)/,
    /.+_0*(\d+)\.\d+:.\.(\d+)([ACGT]*)>([ACGT]*)/
  ];
  for (var i=0; i<reExps.length; ++i) {
    var reExp = reExps[i];
    var res = varInput.match(reExp);
    if (res) {
      var chr = parseInt(res[1]);
      if (chr < 1 || chr > 24) return null;
      if (res[1] === '23') res[1] = 'X';
      else if (res[1] === '24') res[1] = 'Y';
      return  {
        chr: res[1],
        pos: res[2],
        ref: res[3],
        alt: res[4]
      };
    }
  }
  return null;
};
