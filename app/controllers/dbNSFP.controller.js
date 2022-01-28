const utils = require('../utils');
const db = require('../utils/db');

exports.findByVariant = (req, res) => {
  const variant = utils.variant.validateAndParseVariant(req.params.variant);
  const build = req.query.build;

  db.dbnsfp.getByVariant(variant, build)
    .then((doc) => {
      return res.json(doc);
    }).catch((err) => {
      console.log(err);
      return res.status(500).send({
        message: 'Server error occured'
      });
    });
};

