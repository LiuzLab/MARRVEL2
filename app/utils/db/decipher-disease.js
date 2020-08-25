const Promise = require('bluebird');

const decipher = require('../../models/decipher-disease.model');

exports.getByGenomicLocation = (hg19Chr, st, ed) => {
  return new Promise((resolve, reject) => {
    decipher.find(
      { hg19Chr: hg19Chr,
        '$or': [
          { hg19Start: { '$gte': st, '$lte': ed } },
          { hg19Start: { '$lte': st }, hg19Stop: { '$gte': st } }
        ]
      },
      { patientId: 0, from: 0, '_id': 0 }
    )
      .populate({ path: 'phenotypes.ontology', select: '-_id' })
      .lean()
      .then(docs => {
        if (!docs) resolve(null);
        else resolve(docs);
      }).catch(err => {
        reject(err);
      });
  });
};

exports.getByVariant = (variant, projection) => {
  return new Promise((resolve, reject) => {
    if (variant === null) reject('Invalid variant');

    projection = projection || {};
    projection['_id'] = 0;

    decipher.find(
      { hg19Chr: variant.chr, hg19Start: { $lte: parseInt(variant.pos) }, hg19Stop: { $gte: parseInt(variant.pos) } },
      projection
    )
      .populate({ path: 'phenotypes.ontology', select: 'id categories -_id' })
      .then((docs) => {
        if (!docs) resolve(null);
        else resolve(docs);
      }).catch((err) => {
        reject(err);
      });
  });
};

