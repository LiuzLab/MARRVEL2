const express = require('express');
const router = express.Router();

const poController = require('../controllers/po.controller');

router.get('/po/:poId', poController.findByPOId);

module.exports = router;
