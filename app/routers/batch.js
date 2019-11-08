const express = require('express');
const app = express();
const router = express.Router();

const Promise = require('bluebird');

const utils = require('../utils');
const db = require('../utils/db');

router.get('/batch/variants', (req, res) => {
  var variants = req.query.variants || [];
  console.log(variants);
  Promise.all(variants)
    .map((variantStr) => {
      const variant = utils.variant.validateAndParseVariant(variantStr);
      return Promise.all([
        variantStr,
        db.gnomAD.getByVariant(variant),
        db.geno2mp.getByVariant(variant, { hpoCount: 1, homCount: 1, funcAnno: 1, hetCount: 1 }, excludeGene=true),
        db.dgv.getByVariant(variant, { frequency: 1, sampleSize: 1, gain: 1, loss: 1 }, excludeGene=true),
        db.clinvar.getByVariant(variant),
        db.dbnsfp.getByVariant(variant),
      ]).then((arr) => {
        return {
          variant: arr[0],
          gnomADVar: arr[1],
          geno2mp: arr[2],
          dgv: arr[3],
          clinvar: arr[4],
          dbnsfp: arr[5],
        };
      }).catch((err) => {
        console.log(err);
        return {};
      });
    }).then((result) => {
      console.log(' > sent');
      res.json(result);
    }).catch((err) => {
      console.log(err);
      res.send(err);
    });
});

module.exports = router;

