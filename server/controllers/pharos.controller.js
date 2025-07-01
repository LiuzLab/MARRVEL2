const Genes = require('../models/genes.model');
const PharosTargets = require('../models/pharos-targets.model'); // eslint-disable-line no-unused-vars
const pharos = require('../utils/pharos');

exports.getTargetsByEntrezId = (req, res) => {
  const entrezId = req.params.entrezId || '';

  Genes.findOne({ entrezId: parseInt(entrezId) }, { pharosTargetIds: 1 })
    .populate({ path: 'pharosTargets', select: 'accession -_id' })
    .lean()
    .then((doc) => {
      return doc.pharosTargets || [];
    }).map((target) => {
      return pharos.queryTargetByAccession(target.accession);
    }).then((docs) => {
      res.send(docs);
    }).catch((err) => {
      console.log(err);
      res.status(500).send({});
    });
};
