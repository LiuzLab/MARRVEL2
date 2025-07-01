const express = require('express');
const router = express.Router();

const gtexController = require('../controllers/gtex.controller');

router.get('/gtex/gene/entrezId/:entrezId', gtexController.findByEntrezId);
router.get('/gtex/quartiles/gene/entrezId/:entrezId', gtexController.getQuartilesByEntrezId);
router.get('/gtex/quartiles/gene/symbol/:geneSymbol', gtexController.getQuartilesByGeneSymbol);

module.exports = router;
