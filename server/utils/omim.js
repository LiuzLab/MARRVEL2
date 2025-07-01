const Promise = require('bluebird');

const ensembl = require('./ensembl');

exports.filterAlleles = (alleles, variant) => {
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
  // eslint-disable-next-line no-unused-vars
  return new Promise((resolve, reject) => {
    ensembl.getGenomicLocationByVariationId(allele.dbSnps)
      .then((mapping) => {
        allele.isLocationMatched = (mapping.start <= variant.pos && variant.pos <= mapping.end);
        resolve(allele);
      }).catch((err) => {
        console.error(err);
        resolve(allele);
      });
  });
};

exports.markAlleles = (alleles, variant) => {
  return new Promise((resolve, reject) => {
    Promise.all(alleles).map((allele) => {
      return markAllele(allele, variant);
    }).then((res) => {
      resolve(res);
    }).catch((err) => {
      console.error(err);
      reject(err);
    });
  });
};

exports.filterAlleles = (alleles, variant) => {
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
