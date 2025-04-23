const POs = require('../models/phenotype-ontology-terms.model');

exports.findByPOId = (req, res) => {
  const poId = req.params.poId;

  POs.findOne({ id: poId }, { _id: 0 })
    .lean()
    .then((doc) => {
      res.json(doc);
    }).catch((err) => {
      console.log(err);
      return res.status(500).send({
        message: 'Server error occured'
      });
    });
};
