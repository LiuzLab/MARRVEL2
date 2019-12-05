const db = require('../utils/db');

exports.getTargetsByEntrezId = (req, res) => {
  const entrezId = req.params.entrezId || '';

  db.pharos.getDrugsLigandsByEntrezId(entrezId)
    .then(doc => {
      res.json(doc);
    }).catch(err => {
      console.error(err);
      res.status(500).send({
        message: 'Server error occured'
      });
    });
};
