const GnomAD = require('../models/gnomAD.model');
const GnomADGene = require('../models/gnomADGene.model');
const Genes = require('../models/genes.model');

const utils = require('../utils');
const db = require('../utils/db');

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
  if (variant === null) {
    return res.status(404).send({ message: 'Invalid variant' });
  }

  db.gnomAD.getByVariant(variant)
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

  Genes.findOne({ taxonId: 9606, symbol: new RegExp('^' + symbol + '$', 'i') }, { '_id': 1 })
    .then((doc) => {
      if (!doc) {
        return null;
      }
      else {
        return doc['_id'];
      }
    }).then((geneId) => {
      if (!geneId) {
        return res.json({});
      }
      else {
        GnomADGene.findOne({ geneId: geneId }, { '_id': 0, geneId: 0 })
          .then((doc) => {
            if (!doc) {
              return res.json({});
            }
            else {
              return res.json(doc);
            }
          }).catch((err) => {
            console.log(err);
            return res.status(500).send({
              message: 'Server error occured'
            });
          });
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

  Genes.findOne({ entrezId: entrezId }, { '_id': 1 })
    .then((doc) => {
      if (!doc) {
        return null;
      }
      else {
        return doc['_id'];
      }
    }).then((geneId) => {
      if (!geneId) {
        return res.json({});
      }
      else {
        GnomADGene.findOne({ geneId: geneId }, { '_id': 0, geneId: 0 })
          .then((doc) => {
            if (!doc) {
              return res.json({});
            }
            else {
              return res.json(doc);
            }
          }).catch((err) => {
            console.log(err);
            return res.status(500).send({
              message: 'Server error occured'
            });
          });
      }
    }).catch((err) => {
      console.log(err);
      return res.status(500).send({
        message: 'Server error occured'
      });
    });
};
