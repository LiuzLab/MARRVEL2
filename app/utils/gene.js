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

exports.getByGenomicLocation = (chr, pos, build) => {
  return new Promise((resolve, reject) => {
    const query = build === 'hg38' ?
      { chr: chr, grch38Start: { $lte: pos }, grch38Stop: { $gte: pos } } :
      { chr: chr, hg19Start: { $lte: pos }, hg19Stop: { $gte: pos } };
    Genes.find(query, { '_id': 0, clinVarIds: 0, gos: 0, dgvIds: 0, decipherIds: 0, geno2mpIds: 0, phenotypes: 0, gos: 0, expressionSummary: 0, pharosLigandsIds: 0, pharosLigandsIds: 0, pharosTargetIds: 0 })
      .lean()
      .then((docs) => {
        if (!docs) {
          resolve([]);
        } else {
          for (var i=0; i<docs.length; ++i) {
            if (docs[i].alias && (typeof docs[i].alias === 'string')) {
              docs[i].alias = [ docs[i].alias ];
            }
            if (docs[i].xref && docs[i].xref.omimId && docs[i].xref.omimId.length) {
              docs[i].xref.omimId = docs[i].xref.omimId[0];
            }
          }
          resolve(docs);
        }
      }).catch((err) => {
        reject(err);
      });
  });
};

exports.queryGenes = (query) => {
  return new Promise((resolve, reject) => {
    const queries = [];
    const projection = { '_id': 0, clinVarIds: 0, gos: 0, geno2mpIds: 0, dgvIds: 0, phenotypes: 0, pharosTargetIds: 0, id: 0 };
    if (query.ensemblId) {
      queries.push(Genes.findOne({ 'xref.ensemblId': query.ensemblId }, projection).lean());
    }
    if (query.symbol) {
      queries.push(Genes.findOne({ symbol: query.symbol }, projection).lean());
      queries.push(Genes.find({ alias: query.symbol }, projection).lean());
    }

    Promise.all(queries)
      .then((results) => {
        let cnt = 0;
        for (const res of results) {
          cnt += 1
          if (res) {
            if (res.length != null) {
              res[0].otherCandidates = res.slice(1);
              resolve(res[0]);
            } else {
              resolve(res);
            }
            break;
          }
        }
        resolve(null);
      });
  });
};
