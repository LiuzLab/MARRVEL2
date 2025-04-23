const DIOPTOrtholog = require('../models/diopt-ortholog.model');
const Genes = require('../models/genes.model');
const POTerms = require('../models/phenotype-ontology-terms.model');
const IMPCPhenotype = require('../models/impc-phenotypes.model');

const utils = require('../utils');

exports.findByEntrezId = (req, res) => {
  const entrezId = parseInt(req.params.entrezId);

  DIOPTOrtholog.find({ 'entrezId1': entrezId }, { '_id': 0 })
    .populate({
      path: 'gene2',
      select: '-_id -location -lastModified -type -name -status -chr -alias -description -taxonId -clinVarIds -dgvIds -geno2mpIds -hg19Stop -hg19Start',
      populate: [
        {
          path: 'phenotypes.ontology',
          select: 'name categories -_id'
        },
        {
          path: 'impcPhenotypes',
          select: 'poId markerEntrezId markerMgiId poName alleleSymbol lifeStage sex pValue zygosity -_id',
          populate: {
            path: 'phenotype',
            select: 'name categories -_id'
          }
        },
        {
          path: 'gos.ontology',
          select: 'name namespace agrSlimGoId -_id'
        }
      ],
    })
    .populate({ path: 'gene1', select: 'symbol -_id' })
    .lean()
    .then((docs) => {
      return res.json(docs.filter(doc => doc.gene2 != null));
    }).catch((err) => {
      console.log(err);
      return res.status(500).send({
        message: 'Server error occured'
      });
    });
};
