const Promise = require('bluebird');
const rp = require('request-promise');

const Genes = require('../models/genes.model');
const varUtil = require('./variant');

exports.getGenomLocByHgvsVar = (variant, build) => {
  return new Promise((resolve, reject) => {
    build = build === 'hg38' ? 'GRCh38' : 'GRCh37';
    // Get gene information from the reference sequence
    rp({
      method: 'GET',
      uri: `https://rest.variantvalidator.org/VariantValidator/variantvalidator/${build}/${encodeURIComponent(variant)}/all`,
      headers: {
        'content-type': 'application/json'
      }
    }).then(async (respStr) => {
      let resp;
      try {
        resp = JSON.parse(respStr);
      } catch (err) {
        return reject(err);
      }

      let data;
      for (const key in resp) {
        if (resp[key]?.primary_assembly_loci) {
          data = resp[key].primary_assembly_loci;
          break;
        }
      }
      if (!data) {
        // No result
        console.log(resp);
        return resolve({});
      }

      const result = {};
      for (const currBuild in data) {
        if (currBuild.toLowerCase() === build.toLowerCase()) {
          result.chr = varUtil.getChromStr(data[currBuild].vcf.chr);
          result.pos = parseInt(data[currBuild].vcf.pos);
          result.ref = data[currBuild].vcf.ref;
          result.alt = data[currBuild].vcf.alt;
          break;
        }
      }

      if (resp.gene_ids?.entrez_gene_id?.length) {
        result.gene = await Genes.findOne({ entrezId: parseInt(resp.gene_ids.entrez_gene_id) });
      }
      return resolve(result);
    }).catch((err) => {
      console.log(err);
      return reject(err);
    });
  });
};

