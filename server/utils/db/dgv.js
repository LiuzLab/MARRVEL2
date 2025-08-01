const Promise = require('bluebird');

const Dgv = require('../../models/dgv.model');
const Genes = require('../../models/genes.model');

exports.getByVariant = (variant, projection, excludeGene) => {
  return new Promise((resolve, reject) => {
    if (variant === null) {
      return reject(new Error('Invalid variant'));
    }
    projection = projection || { frequency: 0, id: 0 };
    projection['_id'] = 0;

    const Q = Dgv.find({
      hg19Chr: variant.chr,
      hg19Start: { $lte: parseInt(variant.pos) },
      hg19Stop: { $gte: parseInt(variant.pos) }
    });
    if (!excludeGene) Q.populate({ path: 'genes', select: 'entrezId symbol -_id' });

    Q.lean().then((docs) => {
      if (!docs) resolve([]);
      else resolve(docs);
    }).catch((err) => {
      reject(err);
    });
  });
};

const getByEntrezId = (entrezId) => {
  return new Promise((resolve, reject) => {
    Genes.findOne({ entrezId: parseInt(entrezId) }, { dgvIds: 1 })
      .populate({
        path: 'dgvIds',
        select: '-frequency -_id',
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
        if (docs && docs.length) {
          for (let i = 0; i < docs.length; ++i) {
            counts.gains += docs[i].gain;
            counts.losses += docs[i].loss;
          }
        }
        resolve(counts);
      }).catch(err => {
        reject(err);
      });
  });
};

