const express = require('express');
const app = express();
const router = express.Router();

const mutalyzer = require('../utils/mutalyzer');

router.get('/mutalyzer/hgvs/:variant', (req, res) => {
  const variant = req.params.variant || '';
  mutalyzer.getGenomLocByHgvsVar(variant)
    .then(result => {
      this.variant = result;
      return mutalyzer.getGeneByTranscript(variant.substr(0, variant.indexOf(':')));
    }).then(result => {
      if (result) {
        this.variant.gene = result;
      }
      res.send(this.variant);
    }).catch(err => {
      console.log(err);
      res.status(500).send({
        message: 'Server error occured'
      });
    });
});

module.exports = router;

