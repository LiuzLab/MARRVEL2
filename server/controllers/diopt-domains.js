const DioptDomains = require('../models/diopt-domains.model'); // eslint-disable-line no-unused-vars
const Genes = require('../models/genes.model');

exports.getByEntrezId = (req, res) => {
  const entrezId = parseInt(req.params.entrezId || '');
  if (isNaN(entrezId)) {
    return res.status(404).end();
  }
  Genes.findOne({ entrezId }, '-_id entrezId')
    .populate('dioptDomains', '-_id')
    .lean()
    .then((doc) => {
      doc.dioptDomains = doc.dioptDomains || [];
      res.json(doc.dioptDomains);
    }).catch((err) => {
      console.log(err);
      return res.status(500).end();
    });
};
