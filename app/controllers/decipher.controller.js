const decipher = require('../models/decipher.model');

const utils = require('../utils');
const db = require('../utils/db');

exports.findByGenomicLocation = (req, res) => {
  if (!req.params.hg19Chr || req.params.hg19Start == null || req.params.hg19Stop == null) {
    return res.status(404).send({ message: 'Invalid location' });
  }

  db.decipher.getByGenomicLocation(req.params.hg19Chr, parseInt(req.params.hg19Start), parseInt(req.params.hg19Stop))
    .then((docs) => {
      res.json(docs);
    }).catch((err) => {
      console.log(err);
      return res.status(500).send({
        message: 'Server error occured'
      });
    });
};

exports.findByVariant = (req, res) => {
  const variant = utils.variant.validateAndParseVariant(req.params.variant);
  const build = req.query.build;
  if (variant === null) {
    return res.status(404).send({ message: 'Invalid variant' });
  }
  db.decipher.getByVariant(variant, build)
    .then((docs) => {
      res.json(docs);
    }).catch((err) => {
      console.log(err);
      return res.status(500).send({
        message: 'Server error occured'
      });
    });
};

