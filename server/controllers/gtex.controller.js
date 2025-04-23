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

const getQuartiles = (doc) => {
  const data = [];
  if (doc && doc.data) {
    for (const organ in doc.data) {
      data.push({
        organName: organ,
        tissues: []
      });
      for (const tissue in doc.data[organ]) {
        const sorted = doc.data[organ][tissue].sort((a, b) => +a < +b ? -1 : 1);
        const q2 = utils.getMedianFromSortedArr(sorted, 0, sorted.length - 1);
        const q1 = utils.getMedianFromSortedArr(sorted, 0, Math.floor(sorted.length / 2) - 1);
        const q3 = utils.getMedianFromSortedArr(sorted, Math.ceil(sorted.length / 2), sorted.length - 1);
        data[data.length - 1].tissues.push({
          name: tissue,
          min: +sorted[0],
          q1: q1,
          q2: q2,
          q3: q3,
          max: +sorted[sorted.length - 1]
        });
      }
    }
  }
  return data;
};

exports.getQuartilesByEntrezId = (req, res) => {
  const entrezId = parseInt(req.params.entrezId);
  if (isNaN(entrezId)) {
    return res.status(404).send({
      message: 'invalid mimnumber'
    });
  }

  Gtex.findOne({ entrezId: entrezId }, { '_id': 0 })
    .lean()
    .then((doc) => {
      res.json(getQuartiles(doc));
    }).catch(err => {
      console.log(err);
      res.status(500).send({
        message: 'Server error occured'
      });
    });
};

exports.getQuartilesByGeneSymbol = (req, res) => {
  const geneSymbol = req.params.geneSymbol;

  Gtex.findOne({ symbol: geneSymbol }, { data: 1 })
    .lean()
    .then((doc) => {
      res.json(getQuartiles(doc));
    }).catch(err => {
      console.log(err);
      res.status(500).send({
        message: 'Server error occured'
      });
    });
};

