const Promise = require('bluebird');

const Dgv = require('../../models/dgv.model');

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
