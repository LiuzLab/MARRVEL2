const Promise = require('bluebird');

const Genes = require('../models/genes.model');
const OMIMEntry = require('../models/omim-entry.model');

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

exports.findByTitle = async (req, res) => {
  const title = req.params.title || '';
  // const prefix = req.query.prefix || '*,+,#,%,null';
  let docs = [];
  try {
    docs = await OMIMEntry.find({ $text: { $search: title } }, { score: { $meta: 'textScore' } })
      .sort({ score: { $meta: "textScore" } });
  } catch (err) {
    return res.status(500).send({
      message: 'Server error occured'
    });
  }
  const result = [];
  for (const doc of docs) {
    // Sanitize alternative titles
    doc.alternativeTitles = doc.alternativeTitles.map((title) => {
      title = title.trim();
      if (title[0] === '\'' && title[title.length - 1] === '\'') {
        return title.slice(1, title.length - 1)
      }
      return title;
    });

    let genes = [];
    let geneIds = [];
    if (doc.phenotypeMapList) {
      for (const pheno of doc.phenotypeMapList) {
        if (pheno.phenotypeMap && pheno.phenotypeMap.geneIDs) {
          geneIds.push(...pheno.phenotypeMap.geneIDs.split(',')
            .map((e) => parseInt(e))
            .filter((e) => !isNaN(e)));
        }
      }
      if (geneIds.length) {
        try {
          genes = await Genes.find({ taxonId: 9606, entrezId: { $in: geneIds } },
            { entrezId: 1, symbol: 1, hgncId: 1, xref: 1, _id: 0 });
        } catch (err) {
          console.log('Error getting genes', err);
        }
      }
    }
    result.push({
      prefix: doc.prefix,
      mimNumber: doc.mimNumber,
      title: doc.title,
      genes: genes.map((e) => ({
        taxonId: e.taxonId,
        entrezId: e.entrezId,
        symbol: e.symbol,
        hgncId: e.hgncId,
        xref: e.xref
      })),
      alternativeTitles: doc.alternativeTitles,
      status: doc.status,
    });
  }
  return res.json(result);
};

