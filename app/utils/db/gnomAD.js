const Promise = require('bluebird');
const utils = require('../../utils');

const GnomAD = require('../../models/gnomAD.model');
const GnomADGene = require('../../models/gnomADGene.model');
const Genes = require('../../models/genes.model');

const getByEntrezId = (entrezId) => {
  return new Promise((resolve, reject) => {
    Genes.findOne({ entrezId: entrezId }, { '_id': 1 })
      .then((doc) => {
        return (doc || { '_id': null })['_id'];
      }).then((geneId) => {
        if (!geneId) {
          return null;
        }
        else {
          return GnomADGene.findOne({ geneId: geneId }, { '_id': 0, geneId: 0 });
        }
      }).then((doc) => {
        resolve(doc);
      }).catch((err) => {
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
          return null;
        }
        else {
          return GnomADGene.findOne({ geneId: geneId }, { '_id': 0, geneId: 0 });
        }
      }).then((doc) => {
        resolve(doc);
      }).catch((err) => {
        reject(err);
      });
  });
};

exports.getByVariant = (variant, projection) => {
  return new Promise((resolve, reject) => {
    if (variant === null) resolve(null);
    else {
      projection = projection || {};
      projection['_id'] = 0;

      GnomAD.findOne(
        { chr: variant.chr, pos: parseInt(variant.pos), ref: variant.ref, alt: variant.alt },
        projection
      )
        .then((doc) => {
          if (!doc || !doc.lastUpdate || utils.isOlderThan(doc.lastUpdate, 14)) {
            return utils.gnomADAPI.queryByVariant(variant.chr + '-' + variant.pos + '-' + variant.ref + '-' + variant.alt);
          }
          else {
            return doc;
          }
        }).then((doc) => {
          if (doc) replace(doc);
          resolve(doc);
        }).catch((err) => {
          console.log(err);
          resolve(null);
        });
    }
  });
};

const replace = (doc) => {
  return GnomAD.replaceOne(
    { chr: doc.chr, pos: doc.pos, ref: doc.ref, alt: doc.alt },
    doc,
    { upsert: true }
  ).catch((err) => {
    console.error(err);
  });
};

