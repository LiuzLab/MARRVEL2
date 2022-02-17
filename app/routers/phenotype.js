const express = require('express');
const app = express();
const router = express.Router();

const phenotypeController = require('../controllers/phenotype.controller');

router.get('/phenotype/gene/entrezId/:entrezId/orthologs', phenotypeController.getOrthologsByEntrezId);

module.exports = router;
