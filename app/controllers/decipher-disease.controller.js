const decipher = require('../models/decipher-disease.model');

const config = require('../config');
const utils = require('../utils');
const db = require('../utils/db');

exports.findByVariant = (req, res) => {
  const variant = utils.variant.validateAndParseVariant(req.params.variant);
  if (variant === null) {
    return res.status(404).send({ message: 'Invalid variant' });
  }

  if (config.env === 'production' && config.host !== req.hostname) {
    return res.sendStatus(403);
  }

  db.decipherDisease.getByVariant(variant)
    .then((docs) => {
      res.json(docs);
    }).catch((err) => {
      console.log(err);
      return res.status(500).send({
        message: 'Server error occured'
      });
    });
};

