const GnomAD = require('../models/gnomAD.model');

const utils = require('../utils');
const db = require('../utils/db');

// eslint-disable-next-line no-unused-vars
const replace = (doc) => {
  return GnomAD.replaceOne(
    { chr: doc.chr, pos: doc.pos, ref: doc.ref, alt: doc.alt },
    doc,
    { upsert: true }
  ).catch((err) => {
    console.error(err);
  });
};

exports.findByVariant = (req, res) => {
  const variant = utils.variant.validateAndParseVariant(req.params.variant);
  const build = req.query.build;
  if (variant === null) {
    return res.status(404).send({ message: 'Invalid variant' });
  }

  db.gnomAD.getByVariant(variant, null, build)
    .then((doc) => {
      return res.json(doc);
    }).catch((err) => {
      console.log(err);
      return res.status(500).send({
        message: 'Server error occured'
      });
    });
};

exports.findByGeneSymbol = (req, res) => {
  const symbol = req.params.symbol;

  db.gnomAD.getByGeneSymbol(symbol)
    .then(doc => {
      if (!doc) {
        return res.json({});
      } else {
        return res.json(doc);
      }
    }).catch((err) => {
      console.log(err);
      return res.status(500).send({
        message: 'Server error occured'
      });
    });
};

exports.findByGeneEntrezId = (req, res) => {
  const entrezId = req.params.entrezId;
  db.gnomAD.getByEntrezId(entrezId)
    .then((doc) => {
      return res.json(doc);
    }).catch((err) => {
      console.log(err);
      return res.status(500).send({
        message: 'Server error occured'
      });
    });
};
