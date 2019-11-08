const Promise = require('bluebird');

const geno2mp = require('../../models/geno2mp.model');

exports.getByVariant = (variant, projection, excludeGene) => {
  return new Promise((resolve, reject) => {
    if (variant === null) reject('Invalid variant');

    projection = projection || {};
    projection['_id'] = 0;

    var Q = geno2mp.findOne(
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
