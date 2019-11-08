const Promise = require('bluebird');

const decipher = require('../../models/decipher-disease.model');

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

