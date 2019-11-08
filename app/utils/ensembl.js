const Promise = require('bluebird');
const rp = require('request-promise');

const queryHumanVariationById = (vid) => {
  return new Promise((resolve, reject) => {
    rp({
      uri: 'http://grch37.rest.ensembl.org/variation/human/' + vid,
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
          var mapping = res['mappings'];
          var found = false;
          for (var i=0; i<mapping.length; ++i) {
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
}
