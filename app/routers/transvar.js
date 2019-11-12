const express = require('express');
const app = express();
const router = express.Router();

const transvar = require('../utils/transvar');

router.get('/transvar/protein/:protein', (req, res) => {
  const protein = req.params.protein || '';
  transvar.proteinToGenomicLocations(protein)
    .then(result => {
      res.json({
        // version: config.version.name,
        searchTerm: protein,
        candidates: result.candidates,
        errors: result.errors
      });
    }).catch(err => {
      console.log(err);
      res.status(500).send({
        message: 'Server error occured'
      });
    });
});

module.exports = router;
