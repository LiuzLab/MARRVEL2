const express = require('express');
const app = express();
const router = express.Router();

const decipherController = require('../controllers/decipher.controller');
const decipherDiseaseController = require('../controllers/decipher-disease.controller');

router.get('/DECIPHER/variant/:variant', decipherController.findByVariant);

router.get('/DECIPHERDisease/variant/:variant', decipherDiseaseController.findByVariant);

module.exports = router;

