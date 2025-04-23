const Promise = require('bluebird');

const decipher = require('../../models/decipher-disease.model');

exports.getByGenomicLocation = (hg19Chr, st, ed, build) => {
  return new Promise((resolve, reject) => {
    const query = build === 'hg38' ?
      { hg38Chr: hg38Chr,
        '$or': [
          { hg38Start: { '$gte': st, '$lte': ed } },
          { hg38Start: { '$lte': st }, hg38Stop: { '$gte': st } }
        ]
      } :
      { hg19Chr: hg19Chr,
        '$or': [
          { hg19Start: { '$gte': st, '$lte': ed } },
          { hg19Start: { '$lte': st }, hg19Stop: { '$gte': st } }
        ]
      };
    decipher.find(query, { patientId: 0, from: 0, '_id': 0 })
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

exports.getByVariant = (variant, projection, build) => {
  return new Promise((resolve, reject) => {
    if (variant === null) reject('Invalid variant');

    projection = projection || {};
    projection['_id'] = 0;

    query = build === 'hg38' ?
      { hg38Chr: variant.chr, hg38Start: { $lte: variant.pos }, hg38Stop: { $gte: variant.pos } } :
      { hg19Chr: variant.chr, hg19Start: { $lte: variant.pos }, hg19Stop: { $gte: variant.pos } };

    decipher.find(query, projection)
      .populate({ path: 'phenotypes.ontology', select: 'id categories -_id' })
      .then((docs) => {
        if (!docs) resolve(null);
        else resolve(docs);
      }).catch((err) => {
        reject(err);
      });
  });
};

