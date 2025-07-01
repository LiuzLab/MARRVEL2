const express = require('express');
const router = express.Router();

const geno2mpController = require('../controllers/geno2mp.controller');

router.get('/Geno2MP/variant/:variant', geno2mpController.findByVariant);
router.get('/Geno2MP/gene/entrezId/:entrezId', geno2mpController.findByGeneEntrezId);

module.exports = router;

