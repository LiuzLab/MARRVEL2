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
  const taxonId = parseInt(req.params.taxonId);
  const prefix = req.params.prefix;
  const limit = req.params.limit || 30;

  const symbolRegex = new RegExp('^(' + prefix.trim().split(/[^a-zA-Z0-9]+/g).join('|') + ')', (taxonId === 7227 ? '' : 'i'));
  Genes.find({ taxonId: taxonId, symbol: symbolRegex },
    { '_id': 0, clinVarIds: 0, gos: 0, dgvIds: 0, decipherIds: 0 },
    { limit: limit, sort: { symbol: 1 } }
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

exports.findByEnsemblId = (req, res) => {
  const ensemblId = req.params.ensemblId;

  Genes.findOne({ 'xref.ensemblId': ensemblId }, { '_id': 0, clinVarIds: 0, dgvIds: 0, decipherIds: 0, geno2mpIds: 0 })
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
  const build = req.query.build;
  if (!chr || !pos) {
    return res.status(404).send([]);
  }
  geneUtil.getByGenomicLocation(chr, pos, build)
    .then((docs) => {
      return res.json(docs);
    }).catch((err) => {
      console.log(err);
      return res.status(500).send({
        message: 'Server error occured'
      });
    });
};

exports.query = (req, res) => {
  const ensemblId = req.query.ensemblId;
  const symbol = req.query.symbol;
  geneUtil.queryGenes(req.query)
    .then((doc) => {
      return res.json(doc);
    }).catch((err) => {
      console.log(err);
      return res.status(500).send({
        message: 'Server error occured'
      });
    });
};
