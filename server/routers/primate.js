const express = require('express');
const router = express.Router();

const primateController = require('../controllers/primate.controller');

router.get('/primate/variant/:variant', primateController.findByVariant);
router.get('/primate/gene/entrezId/:entrezId', primateController.findByEntrezId);

module.exports = router;
