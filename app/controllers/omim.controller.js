const Promise = require('bluebird');

const OMIM = require('../models/omim.model');
const Genes = require('../models/genes.model');

const utils = require('../utils');
const omimUtils = require('../utils/omim');

const replace = (doc) => {
  return OMIM.replaceOne(
    { mimNumber: doc.mimNumber },
    doc,
    { upsert: true }
  ).catch((err) => {
    console.error(err);
  });
};

const fetchAndUpdate = (mimNumber) => {
  return new Promise((resolve, reject) => {
    mimNumber = parseInt(mimNumber);
    if (isNaN(mimNumber)) {
      reject('Invalid mimNumber');
    }

    OMIM.findOne({ mimNumber: mimNumber }, { '_id': 0 })
      .then((doc) => {
        if (!doc || !doc.lastUpdate || utils.isOlderThan(doc.lastUpdate, 14)) {
          return utils.omimAPI.queryByMimNumber(mimNumber);
        }
        else {
          return doc;
        }
      }).then((doc) => {
        replace(doc);

        if (doc.allelicVariants && doc.allelicVariants.length) {
          for (var i=0; i<doc.allelicVariants.length; ++i) {
            if (doc.allelicVariants[i].mutations) {
              doc.allelicVariants[i].mutations = doc.allelicVariants[i].mutations
                .replace(/\(\{[^})]+\}\)/g, '')
                .trim();
            }
          }
        }
        if (!doc) resolve(null);
        else resolve(doc);
      }).catch((err) => {
        reject(err);
      });
  });
};

exports.findByMimNumber = (req, res) => {
  const mimNumber = parseInt(req.params.mimNumber);

  if (isNaN(mimNumber)) {
    return res.status(404).send({
      message: 'Invalid mimNumber'
    });
  }

  fetchAndUpdate(mimNumber)
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

  Genes.findOne({ taxonId: 9606, symbol: new RegExp('^' + symbol + '$', 'i') }, { '_id': 0, 'clinVarIds': 0, 'gos': 0 })
    .then((doc) => {
      if (!doc) {
        return null;
      }
      else if (doc.xref && doc.xref.omimId) {
        return doc.xref.omimId;
      }
      else {
        return null;
      }
    }).then((mimNumber) => {
      console.log(mimNumber);
      return fetchAndUpdate(mimNumber);
    }).then((doc) => {
      return res.json(doc);
    }).catch((err) => {
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

  Genes.findOne({ taxonId: 9606, symbol: new RegExp('^' + symbol + '$', 'i') }, { '_id': 0, 'clinVarIds': 0, 'gos': 0 })
    .then((doc) => {
      if (!doc) {
        return null;
      }
      else if (doc.xref && doc.xref.omimId) {
        return doc.xref.omimId;
      }
      else {
        return null;
      }
    }).then((mimNumber) => {
      console.log(mimNumber);
      return fetchAndUpdate(mimNumber);
    }).then((doc) => {
      omimUtils.markAlleles((doc.allelicVariants || []), variant)
        .then((alleles) => {
          doc.allelicVariants = alleles;
          return res.json(doc);
        }).catch((err) => {
          doc.allelicVariants = [];
          return res.json(doc);
        });
    }).catch((err) => {
      console.log(err);
      return res.status(500).send({
        message: 'Server error occured'
      });
    });
};
