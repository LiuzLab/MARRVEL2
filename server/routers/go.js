const express = require('express');
const router = express.Router();

const goController = require('../controllers/go.controller');

router.get('/go/gene/entrezId/:entrezId', goController.findByEntrezId);
router.get('/go/gene/taxonId/:taxonId/symbol/:symbol', goController.findByGeneSymbol);

module.exports = router;
