const express = require('express');
const app = express();
const router = express.Router();

const decipherController = require('../controllers/decipher.controller');
const decipherDiseaseController = require('../controllers/decipher-disease.controller');

router.get('/DECIPHER/variant/:variant', decipherController.findByVariant);
router.get('/DECIPHER/genomloc/:hg19Chr/:hg19Start/:hg19Stop', decipherController.findByGenomicLocation);

router.get('/DECIPHERDisease/variant/:variant', decipherDiseaseController.findByVariant);
router.get('/DECIPHERDisease/genomloc/:hg19Chr/:hg19Start/:hg19Stop', decipherDiseaseController.findByGenomicLocation);

module.exports = router;

