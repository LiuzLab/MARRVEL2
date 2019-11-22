const Promise = require('bluebird');

const Dgv = require('../../models/dgv.model');
const Genes = require('../../models/genes.model');

exports.getByVariant = (variant, projection, excludeGene) => {
  return new Promise((resolve, reject) => {
    if (variant === null) reject('Invalid variant');

    projection = projection || {};
    projection['_id'] = 0;

    var Q = Dgv.find(
      { hg19Chr: variant.chr, hg19Start: { $lte: parseInt(variant.pos) }, hg19Stop: { $gte: parseInt(variant.pos) } },
      projection
    );
    if (!excludeGene) Q.populate({ path: 'genes', select: 'entrezId symbol -_id' });

    Q.then((docs) => {
      if (!docs) resolve([]);
      else resolve(docs);
    }).catch((err) => {
      reject(err);
    });
  });
};

const getByEntrezId = (entrezId) => {
  return new Promise((resolve, reject) => {
    Genes.findOne({ entrezId: parseInt(entrezId) }, { 'dgvIds': 1 })
      .populate({
        path: 'dgvIds',
        select: '-_id',
        populate: {
          path: 'genes',
          select: 'entrezId symbol -_id'
        }
      }).then((doc) => {
        resolve((doc || { dgvIds: null }).dgvIds);
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
        const counts = { gains: 0, losses: 0 };
        for (var i = 0; i< docs.length; ++i) {
          counts.gains += docs[i].gain;
          counts.losses += docs[i].loss;
        }
        resolve(counts);
      }).catch(err => {
        reject(err);
      });
  });
};

