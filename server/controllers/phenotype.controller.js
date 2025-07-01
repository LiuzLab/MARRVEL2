const DIOPTOrtholog = require('../models/diopt-ortholog.model');
const Genes = require('../models/genes.model');

exports.getOrthologsByEntrezId = (req, res) => {
  const entrezId = parseInt(req.params.entrezId);

  Genes.findOne({ entrezId }, { phenotypes: 1, _id: 0 })
    .populate({ path: 'phenotypes.ontology', select: 'name categories -_id' })
    .lean()
    .then((geneDoc) => {
      DIOPTOrtholog.find({ entrezId1: entrezId }, { _id: 0 })
        .populate({
          path: 'gene2',
          select: '-_id -location -lastModified -type -name -status -chr -alias -description -taxonId -clinVarIds -dgvIds -geno2mpIds -hg19Stop -hg19Start -gos',
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
            }
          ],
        })
        .lean()
        .then((docs) => {
          return res.json({
            gene: geneDoc,
            orthologs: docs.filter(doc => doc.gene2 != null)
          });
        }).catch((err) => {
          console.log(err);
          return res.status(500).send({
            message: 'Server error occured'
          });
        });
    }).catch((err) => {
      console.log(err);
      return res.status(500).send({
        message: 'Server error occured'
      });
    });
};
