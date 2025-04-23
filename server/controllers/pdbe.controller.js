const Promise = require('bluebird');

const Genes = require('../models/genes.model');
const PdbeSummaries = require('../models/pdbe-summaries.model');
const pdbe = require('../utils/pdbe');
const utils = require('../utils');

const update = (doc) => {
  return new Promise((resolve, reject) => {
    PdbeSummaries.updateOne(
      { uniprotKBId: doc.uniprotKBId },
      { ...doc, lastUpdate: new Date() },
      { upsert: true }
    ).then((res) => {
      resolve(doc);
    }).catch((err) => {
      reject(err);
    });
  });
};

exports.getByEntrezId = (req, res, next) => {
  const entrezId = parseInt(req.params.entrezId);
  if (isNaN(entrezId)) {
    return res.status(404).send({ message: 'Invalid Entrez Gene ID' });
  }
  // Query gene by Entrez ID and pull cached PDBe summary if available
  Genes.findOne({ entrezId: entrezId }, '-_id uniprotKBId')
    .populate('pdbeSummary', '-_id')
    .lean()
    .then((doc) => {
      if (!doc.uniprotKBId) {
        return {};
      } else if (!doc.pdbeSummary || !doc.pdbeSummary.lastUpdate || utils.isOlderThan(doc.pdbeSummary.lastUpdate, 13)) {
        // No cached PDBe data or it needs refresh
        return pdbe.queryByUniportKBId(doc.uniprotKBId).then((qRes) => {
          // Try updating the cache
          update(qRes).catch((err) => { console.log(err); });
          return qRes;
        }).catch((err) => {
          // If API gives error, try serving the cache
          console.log(err);
          return doc.pdbeSummary || {};
        });
      } else {
        // Serve cached data
        return doc.pdbeSummary || {};
      }
    }).then((doc) => {
      return res.send({
        uniprotKBId: doc.uniprotKBId,
        pdbs: doc.pdbs,
        ligands: doc.ligands,
        interactionPartners: doc.interactionPartners,
        annotations: doc.annotations,
        similarProteins: doc.similarProteins
      });
    }).catch((err) => {
      console.log(err);
      return res.status(500).send({
        message: 'Server error occured'
      });
    });
};

