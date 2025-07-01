const Promise = require('bluebird');

const decipher = require('../../models/decipher.model');
const Genes = require('../../models/genes.model'); // eslint-disable-line no-unused-vars

exports.getByGenomicLocation = (hg19Chr, hg19Start, hg19Stop) => {
  return new Promise((resolve, reject) => {
    decipher.find(
      { hg19Chr,
        $or: [
          { hg19Start: { $gte: hg19Start, $lte: hg19Stop } },
          { hg19Start: { $lte: hg19Start }, hg19Stop: { $gte: hg19Start } }
        ]
      },
      { patientId: 0, from: 0, _id: 0 }
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

exports.getByVariant = (variant, build) => {
  return new Promise((resolve, reject) => {
    if (variant === null) {
      reject(new Error('Invalid variant'));
    }

    const query = build === 'hg38' ?
      { hg38Chr: variant.chr, hg38Start: { $lte: variant.pos }, hg38Stop: { $gte: variant.pos } } :
      { hg19Chr: variant.chr, hg19Start: { $lte: variant.pos }, hg19Stop: { $gte: variant.pos } };
    decipher.find(query, { patientId: 0, from: 0, _id: 0 })
      .lean()
      .then((docs) => {
        if (!docs) resolve(null);
        else resolve(docs);
      }).catch((err) => {
        reject(err);
      });
  });
};

