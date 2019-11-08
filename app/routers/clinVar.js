const express = require('express');
const app = express();
const router = express.Router();

const clinVarController = require('../controllers/clinVar.controller');

router.get('/clinVar/gene/symbol/:symbol', clinVarController.findByGeneSymbol);
router.get('/clinVar/gene/entrezId/:entrezId', clinVarController.findByGeneEntrezId);

router.get('/clinVar/variant/:variant', clinVarController.findByVariant);

// Remove below
router.get('/clinVar/symbol/:symbol', clinVarController.findByGeneSymbol);
router.get('/clinVar/entrezId/:entrezId', clinVarController.findByGeneEntrezId);

module.exports = router;
