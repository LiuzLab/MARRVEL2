const Promise = require('bluebird');

const Geno2mp = require('../../models/geno2mp.model');
const Genes = require('../../models/genes.model');

exports.getByVariant = (variant, projection, excludeGene) => {
  return new Promise((resolve, reject) => {
    if (variant === null) reject('Invalid variant');

    projection = projection || {};
    projection['_id'] = 0;

    var Q = Geno2mp.findOne(
      { hg19Chr: variant.chr, hg19Pos: parseInt(variant.pos), ref: variant.ref, alt: variant.alt },
      projection
    );
    if (!excludeGene) Q.populate({ path: 'genes', select: 'entrezId symbol -_id' });

    Q.then((doc) => {
      if (!doc) return resolve(null);
      else resolve(doc.toObject());
    }).catch((err) => {
      reject(err);
    });
  });
};

const getByEntrezId = (entrezId) => {
  return new Promise((resolve, reject) => {
    Genes.findOne({ entrezId: entrezId }, { geno2mpIds: 1, '_id': 0 })
      .populate({ path: 'geno2mpIds', select: '-_id -genes' })
      .lean()
      .then((doc) => {
        resolve((doc || { geno2mpIds: [] }).geno2mpIds);
      }).catch((err) => {
        reject(err);
      });
  });
};
exports.getByEntrezId = getByEntrezId;

exports.getCountsByEntrezId = (entrezId) => {
  return new Promise((resolve, reject) => {
    getByEntrezId(entrezId)
      .then(docs => {
        docs = docs || [];
        const counts = { homCounts: 0, hetCounts: 0, hpoCounts: 0 };
        for (var i = 0; i < docs.length; ++i) {
          counts.homCounts += docs[i].homCount;
          counts.hetCounts += docs[i].hetCount;
          counts.hpoCounts += docs[i].hpoCount;
        }
        resolve(counts);
      }).catch((err) => {
        reject(err);
      });
  });
};

