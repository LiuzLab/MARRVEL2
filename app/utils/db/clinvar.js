const Promise = require('bluebird');

const ClinVar = require('../../models/clinVar.model');
const Genes = require('../../models/genes.model');

exports.getByVariant = (variant) => {
  return new Promise((resolve, reject) => {
    if (!variant) reject('Invalid variant');

    var startPos = parseInt(variant.pos)
    ClinVar.find(
      { chr: variant.chr, start: startPos },
      { uid: 1, title: 1, condition: 1, significance: 1, start: 1, stop: 1, '_id': 0 }
    )
      .then((docs) => {
        const counts = { 'pathogenic': 0, 'likely pathogenic': 0, 'likely benign': 0, 'benign': 0 };
        for (var i = 0; i < docs.length; ++i) {
          if (docs[i].ref && docs[i].ref.length && docs[i].ref != variant.ref) continue;
          if (docs[i].alt && docs[i].alt.length && docs[i].alt != variant.alt) continue;
          resolve(docs[i]);
          break;
        }
        resolve({ significance: {} });
      }).catch((err) => {
        reject(err);
      });
  });
};

exports.getByGeneSymbol = (symbol) => {
  return new Promise((resolve, reject) => {
    Genes.findOne({ taxonId: 9606, symbol: new RegExp('^' + symbol + '$', 'i') }, { 'clinVarIds': 1 })
      .populate({ path: 'clinVar', select: { uid: 1, title: 1, condition: 1, significance: 1, start: 1, stop: 1, '_id': 0 } })
      .then((doc) => {
        if (!doc || !doc.clinVar) resolve([]);
        else resolve(doc.clinVar);
      }).catch((err) => {
        reject(err);
      });
  });
};

const getByGeneEntrezId = (entrezId) => {
  return new Promise((resolve, reject) => {
    Genes.findOne({ entrezId: parseInt(entrezId) }, { 'clinVarIds': 1 })
      .populate({ path: 'clinVar', select: { uid: 1, title: 1, condition: 1, significance: 1, start: 1, stop: 1, '_id': 0 } })
      .then((doc) => {
        if (!doc || !doc.clinVar) resolve([]);
        else resolve(doc.clinVar);
      }).catch((err) => {
        reject(err);
      });
  });
};
exports.getByGeneEntrezId = getByGeneEntrezId;

exports.getCountsByEntrezId = (entrezId) => {
  return new Promise((resolve, reject) => {
    getByGeneEntrezId(entrezId)
      .then(docs => {
        const counts = { 'pathogenic': 0, 'likely pathogenic': 0, 'likely benign': 0, 'benign': 0 };
        for (var i = 0; i < docs.length; ++i) {
          const sig = docs[i].significance.description.toLowerCase();
          counts[sig] = (counts[sig] || 0) + 1;
        }
        resolve({
          pathogenic: counts['pathogenic'],
          likelyPathogenic: counts['likely pathogenic'],
          likelyBenign: counts['likely benign'],
          benign: counts['benign']
        });
      }).catch(err => {
        reject(err);
      });
  });
};

