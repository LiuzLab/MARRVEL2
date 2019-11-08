const express = require('express');
const app = express();
const router = express.Router();

const gtexController = require('../controllers/gtex.controller');

router.get('/gtex/gene/entrezId/:entrezId', gtexController.findByEntrezId);

module.exports = router;
