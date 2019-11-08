const express = require('express');
const app = express();
const router = express.Router();

const agrExpression = require('../controllers/agr-expression.controller');

router.get('/expression/orthologs/gene/entrezId/:entrezId', agrExpression.findByEntrezId);

module.exports = router;
