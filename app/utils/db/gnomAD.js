const Promise = require('bluebird');
const utils = require('../../utils');

const GnomAD = require('../../models/gnomAD.model');

exports.getByVariant = (variant, projection) => {
  return new Promise((resolve, reject) => {
    if (variant === null) resolve(null);
    else {
      projection = projection || {};
      projection['_id'] = 0;

      GnomAD.findOne(
        { chr: variant.chr, pos: parseInt(variant.pos), ref: variant.ref, alt: variant.alt },
        projection
      )
        .then((doc) => {
          if (!doc || !doc.lastUpdate || utils.isOlderThan(doc.lastUpdate, 14)) {
            return utils.gnomADAPI.queryByVariant(variant.chr + '-' + variant.pos + '-' + variant.ref + '-' + variant.alt);
          }
          else {
            return doc;
          }
        }).then((doc) => {
          if (doc) replace(doc);
          resolve(doc);
        }).catch((err) => {
          console.log(err);
          resolve(null);
        });
    }
  });
};

const replace = (doc) => {
  return GnomAD.replaceOne(
    { chr: doc.chr, pos: doc.pos, ref: doc.ref, alt: doc.alt },
    doc,
    { upsert: true }
  ).catch((err) => {
    console.error(err);
  });
};

