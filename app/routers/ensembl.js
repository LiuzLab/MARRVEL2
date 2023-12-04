const express = require('express');
const app = express();
const router = express.Router();

const ensembl = require('../utils/ensembl');

const Genes = require('../models/genes.model');

router.get('/ensembl/isCanonical/:identifiers', async (req, res) => {
  const ids = (req.params.identifiers || '').split(',');
  const justOne = req.query.justOne === 'true';

  let gotResult = false;
  results = [];
  for (const id of ids) {
    const trptId = id.split(':')[0];
    if (trptId.slice(0, 3) !== 'ENS') continue;

    let resp = {};
    try {
      resp = await ensembl.queryLookupByEnsemblId(trptId);
    } catch (err) {
      console.log(err);
    }
    gotResult = true;

    if (resp.is_canonical) {
      let notation = id;
      if (resp.Parent) {
        let gene = {};
        try {
          gene = await ensembl.queryLookupByEnsemblId(resp.Parent);
          if (gene && gene.display_name) {
            gene.symbol = gene.display_name;
          }
        } catch (err) {
          console.log(err);
        }
        if (gene && gene.symbol) {
          notation = gene.symbol + ':' + id.split(':')[1];
        }
      }
      if (justOne) {
        return res.json(notation);
      }
      results.push(notation);
    }
  }
  if (!gotResult) {
    return res.status(500).send('Unknown server error occurred.');
  }
  return res.json(results);
});

module.exports = router;
