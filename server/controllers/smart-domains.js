const Genes = require('../models/genes.model');
const smartDomains = require('../models/smart-domains.model'); // eslint-disable-line no-unused-vars

exports.getByEntrezId = (req, res) => {
  const entrezId = parseInt(req.params.entrezId || '');
  if (isNaN(entrezId)) {
    return res.status(404).end();
  }
  Genes.findOne({ entrezId }, '-_id entrezId')
    .populate('smartDomains', '-_id')
    .lean()
    .then((doc) => {
      doc.smartDomains = doc.smartDomains || [];
      res.json(doc.smartDomains);
    }).catch((err) => {
      console.log(err);
      return res.status(500).end();
    });
};
