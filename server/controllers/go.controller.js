const GOs = require('../models/go.model');
const Genes = require('../models/genes.model');
const geneUtil = require('../utils/gene');

exports.findByGeneSymbol = (req, res) => {
  const taxonId = req.params.taxonId;
  const symbol = req.params.symbol;

  Genes.findOne({ taxonId: taxonId, symbol: new RegExp(symbol, 'i') }, { gos: 1, _id: 0 })
    .populate({
      path: 'gos.ontology',
      select: 'name namespace agrSlimGoId -_id'
    }).then((doc) => {
      if (!doc) {
        return res.status(404).send({});
      }
      else {
        doc = doc.toObject();
        for (const D of doc.gos) {
          D.namespace = '' + D.ontology.namespace;
          D.name = '' + D.ontology.name;
          D.agrSlimGo = agrSlimIdToObj[D.ontology.agrSlimGoId];
          if (!D.agrSlimGo) {
            if (D.namespace === 'molecular_function') {
              D.agrSlimGo = agrSlimIdToObj['GO:0003674'];
            } else if (D.namespace === 'biological_process') {
              D.agrSlimGo = agrSlimIdToObj['GO:0008150'];
            } else {
              D.agrSlimGo = agrSlimIdToObj['GO:0005575'];
            }
          }
          D.agrSlimGo.name = D.agrSlimGo.name.charAt(0).toUpperCase() + D.agrSlimGo.name.slice(1);
          delete D.ontology;
        }
        res.json(doc.gos);
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

  Genes.findOne({ entrezId: entrezId }, { gos: 1, _id: 0 })
    .populate({
      path: 'gos.ontology',
      select: 'name namespace agrSlimGoId -_id'
    }).then((doc) => {
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

const agrSlimIdToObj =  {
  'GO:0016491': { id: 'GO:0016491', name: 'oxidoreductase', namespace: 'molecular_function' },
  'GO:0016787': { id: 'GO:0016787', name: 'hydrolase', namespace: 'molecular_function' },
  'GO:0016740': { id: 'GO:0016740', name: 'transferase', namespace: 'molecular_function' },
  'GO:0016874': { id: 'GO:0016874', name: 'ligase', namespace: 'molecular_function' },
  'GO:0030234': { id: 'GO:0030234', name: 'enzyme regulator', namespace: 'molecular_function' },
  'GO:0038023': { id: 'GO:0038023', name: 'signaling receptor', namespace: 'molecular_function' },
  'GO:0005102': { id: 'GO:0005102', name: 'signaling receptor binding', namespace: 'molecular_function' },
  'GO:0005215': { id: 'GO:0005215', name: 'transporter', namespace: 'molecular_function' },
  'GO:0005198': { id: 'GO:0005198', name: 'structural molecule', namespace: 'molecular_function' },
  'GO:0008092': { id: 'GO:0008092', name: 'cytoskeletal protein binding', namespace: 'molecular_function' },
  'GO:0003677': { id: 'GO:0003677', name: 'DNA binding', namespace: 'molecular_function' },
  'GO:0003723': { id: 'GO:0003723', name: 'RNA binding', namespace: 'molecular_function' },
  'GO:0003700': { id: 'GO:0003700', name: 'DNA-binding transcription factor', namespace: 'molecular_function' },
  'GO:0008134': { id: 'GO:0008134', name: 'transcription factor binding', namespace: 'molecular_function' },
  'GO:0036094': { id: 'GO:0036094', name: 'small molecule binding', namespace: 'molecular_function' },
  'GO:0046872': { id: 'GO:0046872', name: 'metal ion binding', namespace: 'molecular_function' },
  'GO:0030246': { id: 'GO:0030246', name: 'carbohydrate binding', namespace: 'molecular_function' },
  'GO:0097367': { id: 'GO:0097367', name: 'carbohydrate derivative binding', namespace: 'molecular_function' },
  'GO:0008289': { id: 'GO:0008289', name: 'lipid binding', namespace: 'molecular_function' },
  'GO:0003674': { id: 'GO:0003674', name: 'other functions', other: true, namespace: 'molecular_function' },

  'GO:0007049': { id: 'GO:0007049', name: 'cell cycle', namespace: 'biological_process' },
  'GO:0016043': { id: 'GO:0016043', name: 'cellular component organization', namespace: 'biological_process' },
  'GO:0051234': { id: 'GO:0051234', name: 'establishment of localization', namespace: 'biological_process' },
  'GO:0008283': { id: 'GO:0008283', name: 'cell proliferation', namespace: 'biological_process' },
  'GO:0030154': { id: 'GO:0030154', name: 'cell differentiation', namespace: 'biological_process' },
  'GO:0008219': { id: 'GO:0008219', name: 'cell death', namespace: 'biological_process' },
  'GO:0032502': { id: 'GO:0032502', name: 'development', namespace: 'biological_process' },
  'GO:0000003': { id: 'GO:0000003', name: 'reproduction', namespace: 'biological_process' },
  'GO:0002376': { id: 'GO:0002376', name: 'immune system', namespace: 'biological_process' },
  'GO:0050877': { id: 'GO:0050877', name: 'nervous system', namespace: 'biological_process' },
  'GO:0050896': { id: 'GO:0050896', name: 'response to stimulus', namespace: 'biological_process' },
  'GO:0023052': { id: 'GO:0023052', name: 'signaling', namespace: 'biological_process' },
  'GO:0006259': { id: 'GO:0006259', name: 'DNA metabolism', namespace: 'biological_process' },
  'GO:0016070': { id: 'GO:0016070', name: 'RNA metabolism', namespace: 'biological_process' },
  'GO:0019538': { id: 'GO:0019538', name: 'protein metabolism', namespace: 'biological_process' },
  'GO:0005975': { id: 'GO:0005975', name: 'carbohydrate metabolism', namespace: 'biological_process' },
  'GO:1901135': { id: 'GO:1901135', name: 'carbohydrate derivative metabolism', namespace: 'biological_process' },
  'GO:0006629': { id: 'GO:0006629', name: 'lipid metabolism', namespace: 'biological_process' },
  'GO:0042592': { id: 'GO:0042592', name: 'homeostasis', namespace: 'biological_process' },
  'GO:0009056': { id: 'GO:0009056', name: 'catabolism', namespace: 'biological_process' },
  'GO:0065009': { id: 'GO:0065009', name: 'regulation of molecular function', namespace: 'biological_process' },
  'GO:0050789': { id: 'GO:0050789', name: 'regulation of biological process', namespace: 'biological_process' },
  'GO:0007610': { id: 'GO:0007610', name: 'behavior', namespace: 'biological_process' },
  'GO:0008150': { id: 'GO:0008150', name: 'other processes', other: true, namespace: 'biological_process' },

  'GO:0005576': { id: 'GO:0005576', name: 'extracellular region', namespace: 'celluar_component' },
  'GO:0005886': { id: 'GO:0005886', name: 'plasma membrane', namespace: 'celluar_component' },
  'GO:0045202': { id: 'GO:0045202', name: 'synapse', namespace: 'celluar_component' },
  'GO:0030054': { id: 'GO:0030054', name: 'cell junction', namespace: 'celluar_component' },
  'GO:0042995': { id: 'GO:0042995', name: 'cell projection', namespace: 'celluar_component' },
  'GO:0031410': { id: 'GO:0031410', name: 'cytoplasmic vesicle', namespace: 'celluar_component' },
  'GO:0005768': { id: 'GO:0005768', name: 'endosome', namespace: 'celluar_component' },
  'GO:0005773': { id: 'GO:0005773', name: 'vacuole', namespace: 'celluar_component' },
  'GO:0005794': { id: 'GO:0005794', name: 'golgi apparatus', namespace: 'celluar_component' },
  'GO:0005783': { id: 'GO:0005783', name: 'endoplasmic reticulum', namespace: 'celluar_component' },
  'GO:0005829': { id: 'GO:0005829', name: 'cytosol', namespace: 'celluar_component' },
  'GO:0005739': { id: 'GO:0005739', name: 'mitochondrion', namespace: 'celluar_component' },
  'GO:0005634': { id: 'GO:0005634', name: 'nucleus', namespace: 'celluar_component' },
  'GO:0005694': { id: 'GO:0005694', name: 'chromosome', namespace: 'celluar_component' },
  'GO:0005856': { id: 'GO:0005856', name: 'cytoskeleton', namespace: 'celluar_component' },
  'GO:0032991': { id: 'GO:0032991', name: 'protein-containing complex', namespace: 'celluar_component' },
  'GO:0005575': { id: 'GO:0005575', name: 'other components', other: true, namespace: 'celluar_component' }
};
