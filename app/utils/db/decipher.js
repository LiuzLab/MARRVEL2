const Promise = require('bluebird');

const decipher = require('../../models/decipher.model');
const Genes = require('../../models/genes.model');

exports.getByGenomicLocation = (hg19Chr, hg19Start, hg19Stop) => {
  return new Promise((resolve, reject) => {
    decipher.find(
      { hg19Chr: hg19Chr, hg19Start: { '$gte': hg19Start }, hg19Stop: { '$lte': hg19Stop } },
      { patientId: 0, from: 0, '_id': 0 }
    )
      .lean()
      .then(docs => {
        if (!docs) resolve(null);
        else resolve(docs);
      }).catch(err => {
        reject(err);
      });
  });
};

exports.getByVariant = (variant) => {
  return new Promise((resolve, reject) => {
    if (variant === null) reject('Invalid variant');

    decipher.find(
      { hg19Chr: variant.chr, hg19Start: { $lte: parseInt(variant.pos) }, hg19Stop: { $gte: parseInt(variant.pos) } },
      { patientId: 0, from: 0, '_id': 0 }
    )
      .lean()
      .then((docs) => {
        if (!docs) resolve(null);
        else resolve(docs);
      }).catch((err) => {
        reject(err);
      });
  });
};

