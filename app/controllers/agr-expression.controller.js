const DIOPTOrtholog = require('../models/diopt-ortholog.model');
const AGRExpressions = require('../models/agr-expression.model');
const Genes = require('../models/genes.model');

exports.findByEntrezId = (req, res) => {
  const entrezId = parseInt(req.params.entrezId);

  DIOPTOrtholog.find({ 'entrezId1': entrezId }, { '_id': 0 })
    .populate({
      path: 'gene2',
      select: '-_id -gos -phenotypes -location -lastModified -type -name -status -chr -alias -description -taxonId -clinVarIds -dgvIds -geno2mpIds -hg19Stop -hg19Start',
      populate: [
        {
          path: 'agrExpressions',
          select: '-_id'
        },
      ],
    })
    .lean()
    .then((doc) => {
      return res.json(doc)
    }).catch((err) => {
      console.log(err);
      return res.status(500).send({
        message: 'Server error occured'
      });
    });
};
