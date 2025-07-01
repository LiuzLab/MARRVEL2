const exac = require('../models/exac.model');

const utils = require('../utils');

exports.findByVariant = (req, res) => {
  const variant = utils.variant.validateAndParseVariant(req.params.variant);

  if (variant === null) {
    return res.status(404).send({ message: 'Invalid variant' });
  }

  exac.findOne(
    { chr: variant.chr, pos: parseInt(variant.pos), ref: variant.ref, alt: variant.alt },
    { _id: 0 }
  )
    .then((doc) => {
      if (!doc) {
        return res.send(null);
      } else {
        res.send(doc.toObject());
      }
    }).catch((err) => {
      console.log(err);
      return res.status(500).send({
        message: 'Server error occured'
      });
    });
};

