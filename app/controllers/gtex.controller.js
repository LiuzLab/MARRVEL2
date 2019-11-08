const Promise = require('bluebird');

const Gtex = require('../models/gtex.model');

const utils = require('../utils');

exports.findByEntrezId = (req, res) => {
  const entrezId = parseInt(req.params.entrezId);
  if (isNaN(entrezId)) {
    return res.status(404).send({
      message: 'invalid mimnumber'
    });
  }

  Gtex.findOne({ entrezId: entrezId }, { '_id': 0 })
    .lean()
    .then(doc => {
      res.json(doc);
    }).catch(err => {
      console.log(err);
      res.status(500).send({
        message: 'Server error occured'
      });
    });
};

