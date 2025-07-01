const Promise = require('bluebird');
const rp = require('request-promise');

const gene = require('./gene');

const getGeneByRefSeqId = (sid) => {
  return new Promise((resolve, reject) => {
    rp({
      method: 'GET',
      uri: `https://mutalyzer.nl/api/reference_model/?reference_id=${encodeURIComponent(sid)}`,
      headers: {
        'content-type': 'application/json'
      }
    }).then((str) => {
      let ref;
      try {
        ref = JSON.parse(str);
      } catch (err) {
        return reject(err);
      }
      if (!ref || !('annotations' in ref)) {
        return reject(new Error('no mutalyzer result'));
      }

      for (const feature of (ref['annotations']['features'] || [])) {
        if (feature.type === 'gene') {
          return feature;
        }
      }
      return null;
    }).then((feature) => {
      if (!feature) {
        return reject(new Error('no mutalyzer result'));
      }
      this.feature = feature;
      // find gene by the HGNC ID first
      gene.getByHgncId((feature.qualifiers || {}).HGNC || '').then((doc) => {
        if (doc && doc.entrezId) {
          return resolve(doc);
        }
        // find gene by symbol if not found
        const symbol = (feature.qualifiers || {}).name || feature.id;
        gene.getBySymbol(symbol).then((doc) => {
          if (doc && doc.entrezId) {
            return resolve(doc);
          }
          return reject(new Error(`could not find the gene ${symbol}`));
        });
      });
    }).catch((err) => {
      return reject(err);
    });
  });
};
exports.getGeneByRefSeqId = getGeneByRefSeqId;

exports.getGenomLocByHgvsVar = async (variant, build) => {
  return new Promise((resolve, reject) => {
    build = build === 'hg38' ? 'GRCH38' : 'GRCH37';
    // Get gene information from the reference sequence
    rp({
      method: 'GET',
      uri: `https://mutalyzer.nl/api/normalize/${encodeURIComponent(variant)}`,
      headers: {
        'content-type': 'application/json'
      }
    }).then((respStr) => {
      let resp;
      try {
        resp = JSON.parse(respStr);
      } catch (err) {
        return reject(err);
      }
      if (!resp.chromosomal_descriptions || !resp.chromosomal_descriptions.length) {
        return reject(new Error('no mutalyzer result'));
      }
      for (const desc of resp.chromosomal_descriptions) {
        if (desc.assembly === build && desc.g && desc.g.length) {
          const M = desc.g.match(/[^:]+:g.([^ACGTU]+)([ACGTU]*)>([ACGTU]*)/);
          if (M) {
            return resolve({
              pos: parseInt(M[1]),
              ref: M[2],
              alt: M[3]
            });
          }
        }
      }
      return reject(new Error('no mutalyzer result'));
    }).catch((err) => {
      return reject(err);
    });
  });
};

const validateAndParseVariantInput = (varInput) => {
  const reExps = [
    /(?:chr|Chr)?([0-9]?[0-9XY])\s*:\s*([0-9]*)\s*([ACGT]*)\s*>\s*([ACGT]*)/,
    /([0-9]?[0-9XY])\s*-\s*([0-9]*)\s*-\s*([ACGT]*)\s*-\s*([ACGT]*)/,
    /.+_0*(\d+)\.\d+:.\.(\d+)([ACGT]*)>([ACGT]*)/
  ];
  for (let i = 0; i < reExps.length; ++i) {
    const reExp = reExps[i];
    const res = varInput.match(reExp);
    if (res) {
      const chr = parseInt(res[1]);
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
exports.validateAndParseVariantInput = validateAndParseVariantInput;
