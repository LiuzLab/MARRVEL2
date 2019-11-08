const express = require('express');
const app = express();
const router = express.Router();

const gnomADController = require('../controllers/gnomAD.controller');

router.get('/gnomAD/variant/:variant', gnomADController.findByVariant);

router.get('/gnomAD/gene/symbol/:symbol', gnomADController.findByGeneSymbol);
router.get('/gnomAD/gene/entrezId/:entrezId', gnomADController.findByGeneEntrezId);

module.exports = router;
