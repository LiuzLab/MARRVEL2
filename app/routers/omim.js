const express = require('express');
const app = express();
const router = express.Router();

const omimController = require('../controllers/omim.controller');

router.get('/omim/mimNumber/:mimNumber', omimController.findByMimNumber);
router.get('/omim/gene/symbol/:symbol', omimController.findByGeneSymbol);
router.get('/omim/gene/symbol/:symbol/variant/:variant', omimController.findByPair);

// Remove below
router.get('/omim/symbol/:symbol', omimController.findByGeneSymbol);
router.get('/omim/gene/:symbol/variant/:variant', omimController.findByPair);

module.exports = router;
