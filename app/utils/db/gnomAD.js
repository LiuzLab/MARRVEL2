const Promise = require('bluebird');

const utils = require('../../utils');
const gnomADAPI = require('../gnomADAPI');

const GnomAD = require('../../models/gnomAD.model');
const GnomADGene = require('../../models/gnomADGene.model');
const Genes = require('../../models/genes.model');

const getByEntrezId = (entrezId) => {
  return new Promise((resolve, reject) => {
    Genes.findOne({ entrezId: entrezId }, { entrezId: 1, xref: 1, symbol: 1 })
      .populate({ path: 'gnomadGene', select: '-_id' })
      .then((doc) => {
        if (!doc || !doc.entrezId) {
          resolve({});
        } else if (!doc.gnomadGene || !doc.gnomadGene.lastUpdate || utils.isOlderThan(doc.gnomadGene.lastUpdate, 13)) {
          gnomADAPI.queryByGene(doc)
            .then((queryRes) => {
              resolve(queryRes);
            }).catch((err) => {
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
    Genes.findOne({ taxonId: 9606, symbol: new RegExp('^' + symbol + '$', 'i') }, { '_id': 1 })
      .then((doc) => {
        return (doc || { '_id': null })['_id'];
      }).then((geneId) => {
        if (!geneId) {
          resolve(null);
        }
        else {
          GnomADGene.findOne({ geneId: geneId }, { '_id': 0, geneId: 0 })
            .then((queryRes) => {
              resolve(queryRes);
            }).catch((err) => {
              resolve(doc);
            });
        }
      }).then((doc) => {
        resolve(doc);
      }).catch((err) => {
        reject(err);
      });
  });
};

exports.getByVariant = (variant, projection, build) => {
  return new Promise((resolve, reject) => {
    if (variant === null) resolve(null);
    else {
      projection = projection || {};
      projection['_id'] = 0;

      const query = build === 'hg38' ?
        { hg38Chr: variant.chr, hg38Pos: variant.pos, ref: variant.ref, alt: variant.alt } :
        { chr: variant.chr, pos: variant.pos, ref: variant.ref, alt: variant.alt };

      GnomAD.findOne(query, projection)
        .lean()
        .then((doc) => {
          if (!doc || !doc.lastUpdate || utils.isOlderThan(doc.lastUpdate, 14)) {
            return gnomADAPI.queryByVariant(variant.chr + '-' + variant.pos + '-' + variant.ref + '-' + variant.alt);
          } else {
            return doc;
          }
        }).then((doc) => {
          if ('__v' in doc) {
            delete doc['__v'];
          }
          resolve(doc);
        }).catch((err) => {
          console.log(err);
          resolve(null);
        });
    }
  });
};

