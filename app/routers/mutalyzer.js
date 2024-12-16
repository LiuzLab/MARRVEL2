const express = require('express');
const app = express();
const router = express.Router();

const mutalyzer = require('../utils/mutalyzer');

router.get('/mutalyzer/hgvs/:variant', (req, res) => {
  const variant = req.params.variant || '';
  const build = req.params.build || 'hg19';
  mutalyzer.getGenomLocByHgvsVar(variant, build)
    .then((result) => {
      this.variant = result;
      return mutalyzer.getGeneByRefSeqId(variant.substr(0, variant.indexOf(':')));
    }).then((result) => {
      if (result) {
        this.variant.gene = result;
        this.variant.chr = this.variant.chr || result.hg19Chr;
      }
      return res.json(this.variant);
    }).catch(err => {
      console.log(err);
      return res.status(500).send({
        message: 'Server error occured'
      });
    });
});

module.exports = router;

