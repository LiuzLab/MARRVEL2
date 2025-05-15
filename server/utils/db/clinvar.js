const Promise = require('bluebird');

const ClinVar = require('../../models/clinVar.model');
const Genes = require('../../models/genes.model');

const matchVariant = require('../variant').matchVariant;

exports.getByVariant = (variant, build) => {
  return new Promise((resolve, reject) => {
    build = build || 'hg19';

    if (!variant) {
      reject('Invalid variant');
    } else {
      const pos = parseInt(variant.pos)
      const query = {};
      if (build === 'hg38') {
        query.grch38Chr = variant.chr;
        query.grch38Start = query.grch38Stop = pos;
      } else {
        query.chr = variant.chr;
        query.start = query.stop = pos;
      }
      ClinVar.find(query, { uid: 1, title: 1, condition: 1, significance: 1, start: 1, stop: 1, interpretation: 1, '_id': 0 })
        .lean()
        .then((docs) => {
          for (const doc of docs) {
            const thisVar = build === 'hg38' ?
              { chr: doc.grch38Chr, pos: doc.grch38Start, ref: doc.grch38Ref, alt: doc.grch38Alt } :
              { chr: doc.chr, pos: doc.start, ref: doc.ref, alt: doc.alt };
            if (doc.ref && doc.ref.length) {
              if (!matchVariant(variant, thisVar)) continue;
            } else {
              if (doc.title) {
                const match = doc.title.match(/:c.[^ACGTU]+([ACGTU]+)>([ACGTU]+)/);
                if (!match || !matchVariant(variant, { chr: variant.chr, pos: variant.pos, ref: match[1], alt: match[2] })) continue;
              }
            }
            resolve(doc);
            break;
          }
          resolve({ significance: {} });
        }).catch((err) => {
          reject(err);
        });
    }
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
  return new Promise(async (resolve, reject) => {
    try {
      const gene = await Genes.findOne({ entrezId: parseInt(entrezId) },
        'chr hg19Start hg19Stop').lean();
      const docs = await ClinVar.find({
        chr: gene.chr,
        '$or': [
          // gene.hg19Start <= start <= gene.hg19Stop
          { start: { $gte: gene.hg19Start, $lte: gene.hg19Stop } },
          // start <= gene.hg19Start <= stop
          {
            start: { $lte: gene.hg19Start },
            stop: { $gte: gene.hg19Start },
          }
        ]
      }).lean();
      resolve(docs);
    } catch (err) {
      console.log(err);
      return reject(err);
    }
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

