const express = require('express');
const app = express();
const router = express.Router();

const transvar = require('../utils/transvar');

router.get('/transvar/protein/:protein', (req, res) => {
  const protein = req.params.protein || '';
  const build = req.query.build;
  transvar.proteinToGenomicLocations(protein, build)
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

router.get('/transvar/forward/gdna/:identifier', (req, res) => {
  const identifier = req.params.identifier || '';
  const build = req.query.build;
  // Check if it is acceptable annotation (no need to accurate: for the extra security)
  if (!identifier.match(/chr((?:[0-9]+|X|Y|M)):g\.(\d+)(?:_(\d+))?(?:(?:((?:A|C|G|T)+)>((?:A|C|G|T)*))|(?:(delins)((?:A|C|G|T)+))|(?:(del|dup))|(?:(ins)((?:A|C|G|T)*))|(inv))/)) {
    res.status(403).end();
  } else {
    transvar.forwardAnnotationWithGdna(identifier, build)
      .then((result) => {
        res.json(result);
      }).catch(err => {
        console.log(err);
        res.status(500).end();
      });
  }
});

module.exports = router;
