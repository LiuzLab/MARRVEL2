const config = require('../config');
const utils = require('../utils');
const db = require('../utils/db');

exports.findByGenomicLocation = (req, res) => {
  const match = (req.headers.referer || '').match(config.decipher.disease.allowedReferer);
  if (config.env === 'production' && !match) return res.status(403).end();

  if (!req.params.hg19Chr || req.params.hg19Start == null || req.params.hg19Stop == null) {
    return res.status(404).send({ message: 'Invalid location' });
  }

  db.decipherDisease.getByGenomicLocation(req.params.hg19Chr,
    parseInt(req.params.hg19Start), parseInt(req.params.hg19Stop))
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
  const match = (req.headers.referer || '').match(config.decipher.disease.allowedReferer);
  if (config.env === 'production' && !match) return res.status(403).end();

  const variant = utils.variant.validateAndParseVariant(req.params.variant);
  if (variant === null) {
    return res.status(404).send({ message: 'Invalid variant' });
  }

  db.decipherDisease.getByVariant(variant, { patientId: 0 })
    .then((docs) => {
      res.json(docs);
    }).catch((err) => {
      console.log(err);
      return res.status(500).send({
        message: 'Server error occured'
      });
    });
};

