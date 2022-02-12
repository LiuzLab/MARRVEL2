const express = require('express');
const app = express();
const router = express.Router();

const genesController = require('../controllers/genes.controller');
const pdbeController = require('../controllers/pdbe.controller');

router.get('/gene/entrezId/:entrezId', genesController.findByEntrezId);
router.get('/gene/taxonId/:taxonId/symbol/:symbol', genesController.findByGeneSymbol);
router.get('/gene/taxonId/:taxonId/symbol/prefix/:prefix', genesController.findByPrefix);

router.get('/gene/chr/:chr/pos/:pos', genesController.findByGenomicLocation);
router.get('/gene/search', genesController.query);

router.get('/gene/entrezId/:entrezId/pdbe/structure', pdbeController.getByEntrezId);

// Remove below
router.get('/gene/taxonId/:taxonId/entrezId/:entrezId', genesController.findByEntrezId);
router.get('/gene/taxonId/:taxonId/prefix/:prefix', genesController.findByPrefix);

module.exports = router;
