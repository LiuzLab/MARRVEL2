const express = require('express');
const app = express();
const router = express.Router();

const Promise = require('bluebird');

const utils = require('../utils');
const db = require('../utils/db');

const gene = require('../utils/gene');

router.get('/batch/genes', (req, res) => {
  var entrezIds = req.query.entrezIds || [];
  Promise.all(entrezIds)
    .map(entrezId => {
      return Promise.all([
        gene.getByEntrezId(entrezId),
        db.omim.getByEntrezId(entrezId),
        db.clinvar.getCountsByEntrezId(entrezId),
        db.geno2mp.getCountsByEntrezId(entrezId),
        db.gnomAD.getByEntrezId(entrezId),
        db.dgv.getCountsByEntrezId(entrezId),
        db.gos.getByEntrezId(entrezId)
      ]);
    }).map(docs => {
      return {
        entrezId: docs[0].entrezId,
        symbol: docs[0].symbol,
        omim: docs[1] ? {
          mimNumber: docs[1].mimNumber || null,
          numPhenos: (docs[1].phenotypes || []).length,
          numVars: (docs[1].allelicVariants || []).length
        } : null,
        clinvar: docs[2],
        geno2mp: docs[3],
        gnomad: docs[4],
        dgv: docs[5],
        gos: docs[6],
      };
    }).then(doc => {
      res.json(doc);
    }).catch(err => {
      console.error(err);
      res.status(500).send({
        message: 'Server error occured'
      });
    });
});

router.get('/batch/variants', (req, res) => {
  var variants = req.query.variants || [];
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

