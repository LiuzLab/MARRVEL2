const express = require('express');
const router = express.Router();

const vv = require('../utils/vv');

router.get('/mutalyzer/hgvs/:variant', (req, res) => {
  const variant = req.params.variant || '';
  const build = req.params.build || 'hg19';
  vv.getGenomLocByHgvsVar(variant, build)
    .then((result) => {
      return res.json(result);
    }).catch(err => {
      console.log(err);
      return res.status(500).send({
        message: 'Server error occured'
      });
    });
});

module.exports = router;

