const Promise = require('bluebird');

const Genes = require('../models/genes.model');

const utils = require('../utils');
const db = require('../utils/db');

exports.findByMimNumber = (req, res) => {
  const mimNumber = parseInt(req.params.mimNumber);
  if (isNaN(mimNumber)) {
    return res.status(404).send({ message: 'Invalid mimNumber' });
  }

  db.omim.getByMimNumberAndUpdate(mimNumber)
    .then(doc => {
      res.json(doc);
    }).catch(err => {
      console.log(err);
      return res.status(500).send({
        message: 'Server error occured'
      });
    });
};

exports.findByGeneSymbol = (req, res) => {
  const symbol = req.params.symbol;

  db.omim.getByGeneSymbol(symbol)
    .then(doc => {
      res.json(doc);
    }).catch(err => {
      console.log(err);
      return res.status(500).send({
        message: 'Server error occured'
      });
    });
};

exports.findByPair = (req, res) => {
  const symbol = req.params.symbol;
  const variant = utils.variant.validateAndParseVariant(req.params.variant);

  if (variant === null) {
    return res.status(404).send({ message: 'Invalid variant' });
  }

  db.omim.getByPair(symbol, variant)
    .then(doc => {
      res.json(doc);
    }).catch((err) => {
      console.log(err);
      return res.status(500).send({
        message: 'Server error occured'
      });
    });
};
