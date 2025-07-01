const express = require('express');
const router = express.Router();

const dioptOrthologController = require('../controllers/diopt-ortholog.controller');
const dioptAlignmentsController = require('../controllers/diopt-alignments.controller');

router.get('/diopt/ortholog/gene/entrezId/:entrezId', dioptOrthologController.findByEntrezId);

router.get('/diopt/alignment/gene/entrezId/:entrezId', dioptAlignmentsController.findByEntrezId);

// Remove below
router.get('/diopt/ortholog/entrezId/:entrezId', dioptOrthologController.findByEntrezId);

module.exports = router;
