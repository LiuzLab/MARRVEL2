const DIOPTAlignments = require('../models/diopt-alignments.model');
const Genes = require('../models/genes.model'); // eslint-disable-line no-unused-vars
const POTerms = require('../models/phenotype-ontology-terms.model'); // eslint-disable-line no-unused-vars

exports.findByEntrezId = (req, res) => {
  const entrezId = parseInt(req.params.entrezId);

  DIOPTAlignments.findOne({ entrezId }, { _id: 0 })
    .lean()
    .then((doc) => {
      if (doc && doc.data) {
        for (let i = 0; i < doc.data.length; ++i) {
          const style = doc.data[i].style;
          if (!style) continue;

          for (let j = 0; j < style.length; ++j) {
            let clsStr = '';
            if (style[j].indexOf('color: blue') !== -1) {
              clsStr = 'mark-colon';
            } else if (style[j].indexOf('color: red') !== -1) {
              clsStr = 'mark-asterisk';
            } else if (style[j].indexOf('color: purple') === -1) {
              clsStr = 'mark-dot';
            }
            style[j] = clsStr;
          }
        }
      }
      return res.json(doc);
    }).catch((err) => {
      console.log(err);
      return res.status(500).send({
        message: 'Server error occured'
      });
    });
};
