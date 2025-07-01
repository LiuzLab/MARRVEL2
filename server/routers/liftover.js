const express = require('express');
const router = express.Router();

const Liftover = require('../controllers/liftover.controller');

router.get('/liftover/hg38/chr/:chr/pos/:pos/hg19', Liftover.hg38ToHg19);
router.get('/liftover/hg19/chr/:chr/pos/:pos/hg38', Liftover.hg19ToHg38);

module.exports = router;
