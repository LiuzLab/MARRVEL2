const express = require('express');
const router = express.Router();

const exacController = require('../controllers/exac.controller');

router.get('/ExAC/variant/:variant', exacController.findByVariant);

module.exports = router;

