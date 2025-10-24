const Promise = require('bluebird');

const utils = require('../../utils');
const gnomADAPI = require('../gnomADAPI');

const GnomAD = require('../../models/gnomAD.model');
const GnomADGene = require('../../models/gnomADGene.model');
const Genes = require('../../models/genes.model');

const getByEntrezId = (entrezId) => {
  return new Promise((resolve, reject) => {
    Genes.findOne({ entrezId }, { entrezId: 1, xref: 1, symbol: 1 })
      .populate({ path: 'gnomadGene', select: '-_id' })
      .then((doc) => {
        if (!doc || !doc.entrezId) {
          resolve({});
        } else if (!doc.gnomadGene || !doc.gnomadGene.lastUpdate ||
          utils.isOlderThan(doc.gnomadGene.lastUpdate, 13)) {
          gnomADAPI.queryByGene(doc)
            .then((queryRes) => {
              resolve(queryRes);
            }).catch((err) => {
              if (err?.name === 'HTTPError') {
                // just print the status code
                console.error(`Error while querying gnomAD by gene: HTTPError ${err.response?.statusCode}`);
              } else {
                console.error('Error while querying gnomAD by gene', err);
              }
              resolve(doc.gnomadGene || {});
            });
        } else {
          resolve(doc.gnomadGene || {});
        }
      }).catch((err) => {
        console.log(err);
        reject(err);
      });
  });
};
exports.getByEntrezId = getByEntrezId;

exports.getByGeneSymbol = (symbol) => {
  return new Promise((resolve, reject) => {
    Genes.findOne({ taxonId: 9606, symbol: new RegExp(`^${symbol}$`, 'i') }, { entrezId: 1 })
      .then((doc) => {
        return (doc || { entrezId: null }).entrezId;
      }).then((entrezId) => {
        if (!entrezId) {
          return resolve(null);
        }
        return GnomADGene.findOne({ entrezId }, { _id: 0 })
          .then((queryRes) => {
            return queryRes;
          }).catch((err) => {
            console.error('Error while querying gnomAD by gene symbol', err);
            reject(err);
          });
      }).then((doc) => {
        resolve(doc);
      }).catch((err) => {
        reject(err);
      });
  });
};

exports.getByVariant = (variant, projection, build) => {
  // eslint-disable-next-line no-unused-vars
  return new Promise((resolve, reject) => {
    if (variant === null) {
      return resolve(null);
    }
    projection = projection || {};
    projection['_id'] = 0;

    const query = build === 'hg38' ?
      { hg38Chr: variant.chr, hg38Pos: variant.pos, ref: variant.ref, alt: variant.alt } :
      { chr: variant.chr, pos: variant.pos, ref: variant.ref, alt: variant.alt };

    GnomAD.findOne(query, projection)
      .lean()
      .then((doc) => {
        if (!doc || !doc.lastUpdate || utils.isOlderThan(doc.lastUpdate, 14)) {
          return gnomADAPI.queryByVariant(`${variant.chr}-${variant.pos}-${variant.ref}-${variant.alt}`);
        } else {
          return doc;
        }
      }).then((doc) => {
        if (doc && '__v' in doc) {
          delete doc['__v'];
        }
        resolve(doc);
      }).catch((err) => {
        console.log(err);
        resolve(null);
      });
  });
};

