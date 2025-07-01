const Promise = require('bluebird');

const Genes = require('../models/genes.model');

const geneDocToObj = (doc) => {
  doc = doc.toObject();

  if (doc.alias && (typeof doc.alias === 'string')) {
    doc.alias = [doc.alias];
  }
  if (doc.xref && doc.xref.omimId && doc.xref.omimId.length) {
    doc.xref.omimId = doc.xref.omimId[0];
  }
  return doc;
};

exports.getByEntrezId = (entrezId) => {
  return new Promise((resolve, reject) => {
    Genes.findOne({ entrezId },
      { _id: 0, clinVarIds: 0, gos: 0, geno2mpIds: 0, dgvIds: 0, phenotypes: 0 })
      .then((doc) => {
        if (!doc) {
          resolve({});
        } else {
          doc = geneDocToObj(doc);
          resolve(doc);
        }
      }).catch(err => {
        reject(err);
      });
  });
};

exports.getByHgncId = (hgncId) => {
  return new Promise((resolve, reject) => {
    hgncId = parseInt(hgncId);
    if (isNaN(hgncId)) return resolve({});

    Genes.findOne({ hgncId },
      { _id: 0, clinVarIds: 0, gos: 0, geno2mpIds: 0, dgvIds: 0, phenotypes: 0 })
      .then((doc) => {
        if (!doc) {
          return resolve({});
        }
        return resolve(geneDocToObj(doc));
      }).catch(err => {
        return reject(err);
      });
  });
};

exports.getBySymbol = (taxonId, symbol) => {
  return new Promise((resolve, reject) => {
    Genes.findOne({ taxonId, symbol },
      { _id: 0, clinVarIds: 0, gos: 0, geno2mpIds: 0, dgvIds: 0, phenotypes: 0 })
      .then((doc) => {
        if (!doc) {
          resolve({});
        } else {
          doc = doc.toObject();
          if (doc.alias && (typeof doc.alias === 'string')) {
            doc.alias = [doc.alias];
          }
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

exports.getByGenomicLocation = (chr, posStart, posStop, build) => {
  return new Promise((resolve, reject) => {
    let query = build === 'hg38' ?
      { chr, $or: [
        { grch38Start: { $gte: posStart, $lte: posStop } },
        { grch38Stop: { $gte: posStart, $lte: posStop } },
      ] } :
      { chr, $or: [
        { hg19Start: { $gte: posStart, $lte: posStop } },
        { hg19Stop: { $gte: posStart, $lte: posStop } },
      ] };
    if (posStart === posStop) {
      // single position
      query = build === 'hg38' ?
        { chr, grch38Start: { $lte: posStart }, grch38Stop: { $gte: posStart } } :
        { chr, hg19Start: { $lte: posStart }, hg19Stop: { $gte: posStart } };
    }
    Genes.find(query, { _id: 0, clinVarIds: 0, gos: 0, dgvIds: 0, decipherIds: 0, geno2mpIds: 0,
      phenotypes: 0, expressionSummary: 0, pharosLigandsIds: 0, pharosTargetIds: 0 })
      .lean()
      .then((docs) => {
        if (!docs) {
          resolve([]);
        } else {
          for (let i = 0; i < docs.length; ++i) {
            if (docs[i].alias && (typeof docs[i].alias === 'string')) {
              docs[i].alias = [docs[i].alias];
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
    // common filter (taxon ID if given)
    const filter = {};
    if (query.taxonId) {
      filter.taxonId = parseInt(query.taxonId);
    }
    // common projection
    const projection = { _id: 0, clinVarIds: 0, gos: 0, geno2mpIds: 0,
      dgvIds: 0, phenotypes: 0, pharosTargetIds: 0, expressionSummary: 0, id: 0 };

    const queries = [];
    // the first result matches the search term better than the later ones.
    if (query.ensemblId) {
      queries.push(Genes.find({
        ...filter,
        'xref.ensemblId': query.ensemblId.trim()
      }, projection).lean());
    }
    if (query.symbol) {
      // symbol first
      queries.push(Genes.find({
        ...filter,
        symbol: new RegExp(`^${query.symbol}$`, 'i')
      }, projection).sort({ symbol: 1 }).lean());
      // previous symbol next
      queries.push(Genes.find({
        prevSymbols: new RegExp(`^${query.symbol}$`, 'i')
      }, projection, { limit: 30 }).sort({ symbol: 1 }).lean());
      // alias next
      queries.push(Genes.find({
        ...filter,
        alias: new RegExp(`^${query.symbol}$`, 'i')
      }, projection, { limit: 30 }).sort({ symbol: 1 }).lean());
      // partial query
      queries.push(Genes.find({
        ...filter,
        symbol: new RegExp(`${query.symbol}`, 'i')
      }, projection, { limit: 30 }).sort({ symbol: 1 }).lean());
    }

    Promise.all(queries)
      .then((results) => {
        resolve(results
          .filter((e) => e?.length)
          .flat()
          .filter((val, idx, arr) => arr.findIndex((e) => e.entrezId === val.entrezId) === idx)
          .map((e) => {
            if (typeof(e.alias) === 'string') {
              e.alias = [e.alias];
            }
            return e;
          }));
      }).catch((err) => {
        return reject(err);
      });
  });
};
