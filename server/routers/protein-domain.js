const express = require('express');
const app = express();
const router = express.Router();

const smartDomainsController = require('../controllers/smart-domains');
const dioptDomainsController = require('../controllers/diopt-domains');

router.get('/gene/entrezId/:entrezId/protein/domain/smart', smartDomainsController.getByEntrezId);
router.get('/gene/entrezId/:entrezId/protein/domain/diopt', dioptDomainsController.getByEntrezId);

module.exports = router;
