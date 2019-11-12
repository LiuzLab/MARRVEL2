const GOs = require('../models/go.model');
const Genes = require('../models/genes.model');
const geneUtil = require('../utils/gene');

exports.findByGeneSymbol = (req, res) => {
  const taxonId = req.params.taxonId;
  const symbol = req.params.symbol;

  geneUtil.getBySymbol(taxonId, symbol)
    .then((doc) => {
      res.json(doc);
    }).catch((err) => {
      console.log(err);
      return res.status(500).send({
        message: 'Server error occured'
      });
    });
};

exports.findByPrefix = (req, res) => {
  const taxonId = req.params.taxonId;
  const prefix = req.params.prefix;
  const limit = req.params.limit || 10;

  Genes.find({ taxonId: taxonId, symbol: new RegExp('^' + prefix, 'i') },
    { '_id': 0, clinVarIds: 0, gos: 0, dgvIds: 0, decipherIds: 0 },
    { limit: limit }
  )
    .then((docs) => {
      if (!docs) {
        return res.status(404).send([]);
      }
      else {
        res.json(docs);
      }
    }).catch((err) => {
      console.log(err);
      return res.status(500).send({
        message: 'Server error occured'
      });
    });
};

exports.findByEntrezId = (req, res) => {
  const entrezId = parseInt(req.params.entrezId);

  Genes.findOne({ entrezId: entrezId }, { '_id': 0, clinVarIds: 0, dgvIds: 0, decipherIds: 0, geno2mpIds: 0 })
    .populate({ path: 'phenotypes.ontology', select: 'id name categories -_id' })
    .populate(
        {
          path: 'gos.ontology',
          select: 'name namespace agrSlimGoId -_id'
        }
    )
    .then((doc) => {
      if (!doc) {
        return res.status(404).send({});
      }
      else {
        doc = doc.toObject();

        if (doc.alias && (typeof doc.alias === 'string')) doc.alias = [ doc.alias ];
        if (doc.xref && doc.xref.omimId && doc.xref.omimId.length) {
          doc.xref.omimId = doc.xref.omimId[0];
        }
        res.json(doc);
      }
    }).catch((err) => {
      console.log(err);
      return res.status(500).send({
        message: 'Server error occured'
      });
    });
};

exports.findByGenomicLocation = (req, res) => {
  const chr = req.params.chr;
  const pos = parseInt(req.params.pos);
  if (!chr || !pos) {
    return res.status(404).send([]);
  }
  Genes.find(
    { chr: chr, hg19Start: { $lte: pos }, hg19Stop: { $gte: pos } },
    { symbol: 1, entrezId: 1, hgncId: 1, name: 1, xref: 1, status: 1, type: 1, chr: 1, hg19Start: 1, hg19Stop: 1, location: 1, alias: 1, '_id': 0 }
  ).lean(true)
    .then((docs) => {
      if (!docs) return res.json([]);
      else {
        for (var i=0; i<docs.length; ++i) {
          if (docs[i].alias && (typeof docs[i].alias === 'string')) docs[i].alias = [ docs[i].alias ];
          if (docs[i].xref && docs[i].xref.omimId && docs[i].xref.omimId.length) {
            docs[i].xref.omimId = docs[i].xref.omimId[0];
          }
        }
        return res.json(docs);
      }
    }).catch((err) => {
      console.log(err);
      return res.status(500).send({
        message: 'Server error occured'
      });
    });
};
