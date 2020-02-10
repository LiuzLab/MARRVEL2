const Promise = require('bluebird');

const Genes = require('../models/genes.model');

exports.getByEntrezId = (entrezId) => {
  return new Promise((resolve, reject) => {
    Genes.findOne({ entrezId: entrezId }, { '_id': 0, clinVarIds: 0, gos: 0, geno2mpIds: 0, dgvIds: 0, phenotypes: 0 })
      .then(doc => {
        if (!doc) {
          resolve({});
        }
        else {
          doc = doc.toObject();

          if (doc.alias && (typeof doc.alias === 'string')) doc.alias = [ doc.alias ];
          if (doc.xref && doc.xref.omimId && doc.xref.omimId.length) {
            doc.xref.omimId = doc.xref.omimId[0];
          }
          resolve(doc);
        }
      }).catch(err => {
        reject(err);
      });
  });
};

exports.getBySymbol = (taxonId, symbol) => {
  return new Promise((resolve, reject) => {
    Genes.findOne({ taxonId: taxonId, symbol: symbol }, { '_id': 0, clinVarIds: 0, gos: 0, geno2mpIds: 0, dgvIds: 0, phenotypes: 0 })
      .then((doc) => {
        if (!doc) {
          resolve({});
        }
        else {
          doc = doc.toObject();

          if (doc.alias && (typeof doc.alias === 'string')) doc.alias = [ doc.alias ];
          if (doc.xref && doc.xref.omimId && doc.xref.omimId.length) {
            doc.xref.omimId = doc.xref.omimId[0];
          }
          resolve(doc);
        }
      }).catch((err) => {
        reject(err);
      });
  });
};

