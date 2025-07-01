const Promise = require('bluebird');
const rp = require('request-promise');
const got = Promise.promisify(require('got'));

const queryHumanVariationById = (vid) => {
  return new Promise((resolve, reject) => {
    rp({
      uri: `http://grch37.rest.ensembl.org/variation/human/${vid}`,
      qs: {
        'content-type': 'application/json'
      },
      headers: { 'User-Agent': 'Request-Promise' },
      json: true
    }).then((res) => {
      resolve(res);
    }).catch((err) => {
      reject(err);
    });
  });
};
exports.queryHumanVariationById;

exports.getGenomicLocationByVariationId = (vid, strand) => {
  return new Promise((resolve, reject) => {
    strand = strand || 1;
    if (!vid) resolve({});
    else {
      queryHumanVariationById(vid).then((res) => {
        if (!('mappings' in res)) resolve({});
        else {
          const mapping = res['mappings'];
          let found = false;
          for (let i = 0; i < mapping.length; ++i) {
            if (mapping[i].strand === strand) {
              found = true;
              resolve(mapping[i]);
              break;
            }
          }
          if (!found) resolve({});
        }
      }).catch((err) => {
        reject(err);
      });
    }
  });
};

exports.queryLookupByEnsemblId = (ensemblId) => {
  return new Promise((resolve, reject) => {
    if (!ensemblId || ensemblId.slice(0, 2) != 'EN') {
      reject(new Error('Invalid Ensembl ID'));
    } else {
      const url = `https://grch37.rest.ensembl.org/lookup/id/${ensemblId}`;
      got.get(url, { headers: { 'content-type': 'application/json' } })
        .json()
        .then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
    }
  });
};
