const geno2mp = require('../models/geno2mp.model');
const Genes = require('../models/genes.model');

const utils = require('../utils');
const db = require('../utils/db');

exports.findByVariant = (req, res) => {
  const variant = utils.variant.validateAndParseVariant(req.params.variant);
  if (variant === null) {
    return res.status(404).send({ message: 'Invalid variant' });
  }

  db.geno2mp.getByVariant(variant)
    .then((doc) => {
      res.json(doc);
    }).catch((err) => {
      console.log(err);
      return res.status(500).send({
        message: 'Server error occured'
      });
    });
};

exports.findByGeneEntrezId = (req, res) => {
  const entrezId = req.params.entrezId;

  Genes.findOne({ entrezId: entrezId }, { '_id': 0, geno2mpIds: 1 })
    .populate({ path: 'geno2mpIds', select: '-_id -genes' })
    .then((doc) => {
      if (!doc) {
        return res.status(404).send([]);
      }
      else {
        res.json(doc.geno2mpIds);
      }
    }).catch((err) => {
      console.log(err);
      return res.status(500).send({
        message: 'Server error occured'
      });
    });
};

