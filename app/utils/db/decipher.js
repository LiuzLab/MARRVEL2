const Promise = require('bluebird');

const decipher = require('../../models/decipher.model');

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

