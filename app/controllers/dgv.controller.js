const dgv = require('../models/dgv.model');
const Genes = require('../models/genes.model');

const utils = require('../utils');
const db = require('../utils/db');

exports.findByVariant = (req, res) => {
  const variant = utils.variant.validateAndParseVariant(req.params.variant);
  if (variant === null) {
    return res.status(404).send({ message: 'Invalid variant' });
  }

  db.dgv.getByVariant(variant)
    .then((docs) => {
      res.json(docs);
    }).catch((err) => {
      console.log(err);
      return res.status(500).send({
        message: 'Server error occured'
      });
    });
};

exports.findByGeneEntrezId = (req, res) => {
  const entrezId = req.params.entrezId;
  Genes.findOne({ taxonId : 9606, entrezId: parseInt(entrezId) }, { 'dgvIds': 1 })
    .populate({
      path: 'dgvIds',
      select: '-_id',
      populate: {
        path: 'genes',
        select: 'entrezId symbol -_id'
      }
    })
    .then((doc) => {
      if (!doc) {
        return res.send({});
      }
      else {
        res.send(doc.dgvIds);
      }
    }).catch((err) => {
      console.log(err);
      return res.status(500).send({
        message: 'Server error occured'
      });
    });
};
