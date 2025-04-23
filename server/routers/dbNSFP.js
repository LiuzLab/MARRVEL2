const express = require('express');
const app = express();
const router = express.Router();

const dbNSFPController = require('../controllers/dbNSFP.controller');

router.get('/dbNSFP/variant/:variant', dbNSFPController.findByVariant);

module.exports = router;
