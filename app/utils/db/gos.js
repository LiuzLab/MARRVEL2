const Promise = require('bluebird');

const Genes = require('../../models/genes.model');

const EXP_EVICODES = { 'IEP': true, 'IDA': true, 'IMP': true, 'IGI': true, 'IPI': true, 'IAGP': true };

exports.getByEntrezId = (entrezId) => {
  return new Promise((resolve, reject) => {
    Genes.findOne({ entrezId: entrezId }, { gos:1, '_id': 0 })
      .populate({ path: 'gos.ontology', select: 'name namespace agrSlimGoId -_id' })
      .lean()
      .then(doc => {
        if (doc && doc.gos && doc.gos.length) {
          var D = {};
          for (var i=0; i<doc.gos.length; ++i) {
            const go = doc.gos[i];
            D[go.goId] = {
              goId: go.goId,
              namespace: go.ontology.namespace,
              name: go.ontology.name
            };
          }
          resolve(Object.values(D));
        } else {
          resolve(null);
        }
      }).catch(err => {
        reject(err);
      });
  });
};


