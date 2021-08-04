const Primate = require('../models/primate.model');
const utils = require('../utils');

exports.findByVariant = (req, res) => {
  const variant = utils.variant.validateAndParseVariant(req.params.variant);
  if (variant === null) {
    return res.status(404).send({ message: 'Invalid variant' });
  }

  Primate.findOne({ chr: variant.chr, pos: variant.pos, ref: variant.ref, alt: variant.alt }, { _id: 0 })
    .lean()
    .then((doc) => {
      return res.json({
        chr: doc.chr,
        pos: doc.pos,
        ref: doc.ref,
        alt: doc.alt,
        alleleCount: doc.AC,
        alleleNum: doc.AN,
        alleleFreq: doc.AF,
        abHet: doc.ABHet,
        abHom: doc.ABHom,
        filter: doc.filter,
        baseQRankSum: doc.BaseQRankSum,
        excessHet: doc.ExcessHet,
        phredP: doc.FS,
        mleAC: doc.MLEAC,
        mleAF: doc.MLEAF
      });
    }).catch((err) => {
      console.log(err);
      return res.status(500).send({
        message: 'Server error occured'
      });
    });
};

