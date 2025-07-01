const express = require('express');
const router = express.Router();

const Genes = require('../models/genes.model');
const utils = require('../utils');

router.get('/ppi/entrezId/:entrezId', async (req, res) => {
  const geneId = req.params.entrezId || '';
  let gene;
  try {
    gene = await Genes.findOne({ entrezId: parseInt(geneId) });
  } catch (err) {
    console.log('Error getting gene doc', err);
    return res.status(500).end();
  }
  if (!gene) {
    return res.status(400).json('Invalid gene ID');
  }

  utils.ppi.getGroupedPpi(gene.entrezId)
    .map((ppi) => {
      ppi.source.symbol = gene.symbol;
      return Promise.all([ppi, utils.ppi.getGroupedPpi(ppi.interactor.entrezId, true)]);
    }).map((data) => {
      return {
        source: data[0].source,
        interactor: {
          entrezId: data[0].interactor.entrezId,
          symbol: data[0].interactor.symbol,
          ppis: data[1]
        },
        evidences: data[0].evidences
      };
    }).then((ppis) => {
      return res.json(ppis);
    }).catch((err) => {
      console.log('Error on PPI', err);
      return res.status(500).send([]);
    });
});

module.exports = router;
