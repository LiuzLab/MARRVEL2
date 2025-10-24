const express = require('express');
const router = express.Router();

const omimController = require('../controllers/omim.controller');

router.get('/omim/mimNumber/:mimNumber', omimController.findByMimNumber);
router.get('/omim/gene/symbol/:symbol', omimController.findByGeneSymbol);
router.get('/omim/gene/symbol/:symbol/variant/:variant', omimController.findByPair);

router.get('/omim/title/:title', omimController.findByTitle);
router.get('/omim/phenotypes/title/:title', omimController.findPhenotypesByTitle);

// Remove below
router.get('/omim/symbol/:symbol', omimController.findByGeneSymbol);
router.get('/omim/gene/:symbol/variant/:variant', omimController.findByPair);

module.exports = router;
