const express = require('express');
const app = express();
const router = express.Router();

const dgvController = require('../controllers/dgv.controller');

router.get('/DGV/variant/:variant', dgvController.findByVariant);
router.get('/DGV/gene/entrezId/:entrezId', dgvController.findByGeneEntrezId);

module.exports = router;

