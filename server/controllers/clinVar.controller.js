const utils = require('../utils');
const db = require('../utils/db');

exports.findByGeneSymbol = (req, res) => {
  const symbol = req.params.symbol;

  db.clinvar.getByGeneSymbol(symbol)
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
  if (!entrezId) return res.sendStatus(404);

  db.clinvar.getByGeneEntrezId(entrezId)
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
  if (!variant) return res.sendStatus(404);

  db.clinvar.getByVariant(variant, build)
    .then((doc) => {
      res.json(doc);
    }).catch((err) => {
      console.log(err);
      return res.status(500).send({
        message: 'Server error occured'
      });
    });
};
