const express = require('express');
const router = express.Router();

const pharosController = require('../controllers/pharos.controller');

router.get('/pharos/targets/gene/entrezId/:entrezId', pharosController.getTargetsByEntrezId);

module.exports = router;

