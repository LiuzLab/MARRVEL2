const Promise = require('bluebird');

const utils = require('..');
const ensembl = require('../ensembl');
const OMIM = require('../../models/omim.model');
const Genes = require('../../models/genes.model');

const getByMimNumberAndUpdate = (mimNumber) => {
  return new Promise((resolve, reject) => {
    mimNumber = parseInt(mimNumber);
    if (isNaN(mimNumber)) {
      reject('Invalid mimNumber');
    }

    OMIM.findOne({ mimNumber: mimNumber }, { '_id': 0 })
      .lean()
      .then((doc) => {
        if (!doc || !doc.lastUpdate || utils.isOlderThan(doc.lastUpdate, 14)) {
          return utils.omimAPI.queryByMimNumber(mimNumber).then((apiRes) => {
            replaceDoc(apiRes);
            return apiRes;
          }).catch((err) => {
            return doc ? doc : reject(err);
          });
        }
        else {
          return doc;
        }
      }).then((doc) => {
        if (doc.allelicVariants && doc.allelicVariants.length) {
          for (var i=0; i<doc.allelicVariants.length; ++i) {
            if (doc.allelicVariants[i].mutations) {
              doc.allelicVariants[i].mutations = doc.allelicVariants[i].mutations
                .replace(/\(\{[^})]+\}\)/g, '')
                .trim();
            }
          }
        }
        if ('__v' in doc) {
          delete doc['__v'];
        }

        if (!doc) resolve(null);
        else resolve(doc);
      }).catch((err) => {
        reject(err);
      });
  });
};
exports.getByMimNumberAndUpdate = getByMimNumberAndUpdate;

const getMimNumberByEntrezId = (entrezId) => {
  return new Promise((resolve, reject) => {
    Genes.findOne({ entrezId: entrezId }, { 'xref.omimId': 1, '_id': 0 })
      .then(doc => {
        if (doc && doc.xref && doc.xref.omimId) {
          resolve(doc.xref.omimId);
        }
        else {
          resolve(null);
        }
      }).catch(err => {
        reject(err);
      });
  });
};
exports.getMimNumberByEntrezId = getMimNumberByEntrezId;

exports.getByEntrezId = (entrezId) => {
  return new Promise((resolve, reject) => {
    getMimNumberByEntrezId(entrezId)
      .then(mimNumber => {
        if (mimNumber == null) {
          return null;
        } else {
          return getByMimNumberAndUpdate(mimNumber);
        }
      }).then(doc => {
        return resolve(doc);
      }).catch(err => {
        console.log(err);
        return res.status(500).send({
          message: 'Server error occured'
        });
      });
  });
};

const getByGeneSymbol = (symbol) => {
  return new Promise((resolve, reject) => {
    Genes.findOne({ taxonId: 9606, symbol: new RegExp('^' + symbol + '$', 'i') }, { '_id': 0, 'clinVarIds': 0, 'gos': 0 })
      .then(doc => {
        if (doc && doc.xref && doc.xref.omimId) {
          return doc.xref.omimId;
        }
        else {
          return null;
        }
      }).then(mimNumber => {
        if (mimNumber == null) {
          return null;
        } else {
          return getByMimNumberAndUpdate(mimNumber);
        }
      }).then(doc => {
        resolve(doc);
      }).catch(err => {
        reject(err);
      });
  });
};
exports.getByGeneSymbol = getByGeneSymbol;

exports.getByPair = (symbol, variant) => {
  return new Promise((resolve, reject) => {
    getByGeneSymbol(symbol)
      .then((doc) => {
        this.doc = doc;
        return markAlleles((doc.allelicVariants || []), variant);
      }).then((alleles) => {
        this.doc.allelicVariants = alleles;
        resolve(this.doc);
      }).catch((err) => {
        this.doc.allelicVariants = [];
        resolve(this.doc);
      }).catch(err => {
        reject(err);
      });
  });
};

const filterAlleles = (alleles, variant) => {
  return new Promise((resolve, reject) => {
    Promise.all(alleles)
      .map((allele) => {
        return ensembl.getGenomicLocationByVariationId(allele.dbSnps);
      }).filter((mapping) => {
        return (mapping.start <= variant.pos && variant.pos <= mapping.end);
      }).then((res) => {
        resolve(res);
      }).catch((err) => {
        console.log('Error while filtering OMIM Allele');
        console.error(err);
        reject(err);
      });
    });
};

const markAllele = (allele, variant) => {
  return new Promise((resolve, reject) => {
    ensembl.getGenomicLocationByVariationId(allele.dbSnps)
      .then((mapping) => {
        allele.isLocationMatched = (mapping.start <= variant.pos && variant.pos <= mapping.end);
        resolve(allele);
      }).catch((err) => {
        // console.error(err);
        resolve(allele);
      });
  });
};

const markAlleles = (alleles, variant) => {
  return new Promise((resolve, reject) => {
    Promise.all(alleles).map((allele) => {
      return markAllele(allele, variant);
    }).then((res) => {
      resolve(res);
    }).catch((err) => {
      // console.error(err);
      reject(err);
    });
  });
};

const replaceDoc = (doc) => {
  if (!(doc?.mimNumber)) {
    return;
  }
  return OMIM.replaceOne(
    { mimNumber: doc.mimNumber },
    doc,
    { upsert: true }
  ).catch((err) => {
    console.error(err);
  });
};

