const Promise = require('bluebird');
const fs = require('fs');
const path = require('path');
const got = Promise.promisify(require('got'));

const config = require('../config');

const GnomAD = require('../models/gnomAD.model');
const GnomADGene = require('../models/gnomADGene.model');

const variantQuery = fs.readFileSync(path.join(config.root,
  'utils/gnomad-variant-query.txt')).toString();
const geneQuery = fs.readFileSync(path.join(config.root, 'utils/gnomad-gene-query.txt')).toString();

const queryByGene = (gene, referenceGenome) => {
  referenceGenome = referenceGenome || 'GRCh37';
  return new Promise((resolve, reject) => {
    if (!gene.entrezId || !gene.symbol && (!gene.xref || !gene.xref.ensemblId)) {
      return resolve(null);
    }
    const filter = { referenceGenome };
    if (gene.xref?.ensemblId?.length) {
      filter.geneId = gene.xref.ensemblId;
    } else {
      filter.geneSymbol = gene.symbol;
    }
    got.post('https://gnomad.broadinstitute.org/api/', { json: {
      operationName: 'Gene',
      query: geneQuery,
      variables: filter
    } }).then((res) => {
      let data;
      try {
        data = JSON.parse(res?.body || '').data.gene;
      } catch (err) {
        console.log('Error parsing gnomAD result');
        console.log(filter);
        console.log(err);
        data = {};
      }
      // eslint-disable-next-line camelcase
      data.gnomad_constraint = data.gnomad_constraint || {};
      return {
        entrezId: gene.entrezId,
        ensemblId: data.gene_id,
        symbol: data.symbol,
        mis: {
          obs: data.gnomad_constraint.obs_mis,
          z: data.gnomad_constraint.mis_z,
          exp: data.gnomad_constraint.exp_mis,
          oe: data.gnomad_constraint.oe_mis,
          oeLower: data.gnomad_constraint.oe_mis_lower,
          oeUpper: data.gnomad_constraint.oe_mis_upper,
        },
        syn: {
          obs: data.gnomad_constraint.obs_syn,
          z: data.gnomad_constraint.syn_z,
          exp: data.gnomad_constraint.exp_syn,
          oe: data.gnomad_constraint.oe_syn,
          oeLower: data.gnomad_constraint.oe_syn_lower,
          oeUpper: data.gnomad_constraint.oe_syn_upper,
        },
        lof: {
          obs: data.gnomad_constraint.obs_lof,
          z: data.gnomad_constraint.lof_z,
          exp: data.gnomad_constraint.exp_lof,
          oe: data.gnomad_constraint.oe_lof,
          oeLower: data.gnomad_constraint.oe_lof_lower,
          oeUpper: data.gnomad_constraint.oe_lof_upper,
          pLI: data.gnomad_constraint.pLI,
        },
        flags: data.flags,
        lastUpdate: new Date()
      };
    }).then((doc) => {
      GnomADGene.updateOne({ entrezId: doc.entrezId },
        { $set: doc }, { upsert: true })
        .catch((err) => {
          console.error(err);
        });
      return resolve(doc);
    }).catch((err) => {
      return reject(err);
    });
  });
};
exports.queryByGene = queryByGene;

const queryByVariant = (variantId, referenceGenome, datasetId) => {
  referenceGenome = referenceGenome || 'GRCh37';
  datasetId = datasetId || 'gnomad_r2_1';
  return got.post('https://gnomad.broadinstitute.org/api/', { json: {
    operationName: 'GnomadVariant',
    query: variantQuery,
    variables: {
      variantId,
      referenceGenome,
      datasetId
    }
  } }).json().then((res) => {
    if (res.data == null || res.data.variant == null) {
      return null;
    } else {
      res.data.variant.exome = res.data.variant.exome || {};
      res.data.variant.genome = res.data.variant.genome || {};
      return {
        chr: res.data.variant.chrom,
        pos: res.data.variant.pos,
        ref: res.data.variant.ref,
        alt: res.data.variant.alt,
        exome: {
          alleleCount: res.data.variant.exome.ac,
          alleleNum: res.data.variant.exome.an,
          homCount: res.data.variant.exome.ac_hom
        },
        genome: {
          alleleCount: res.data.variant.genome.ac,
          alleleNum: res.data.variant.genome.an,
          homCount: res.data.variant.genome.ac_hom
        },
        transcripts: res.data.variant.transcript_consequences.map((item) => ({
          geneSymbol: item['gene_symbol'],
          geneEnsemblId: item['gene_id'],
          ensemblId: item['transcript_id'],
          isCanonical: item['is_canonical'],
          isManeSelect: item['is_mane_select'],
          lof: item['lof'],
        })),
        lastUpdate: new Date()
      };
    }
  }).then((doc) => {
    if (doc) {
      GnomAD.updateOne({ chr: doc.chr, pos: doc.pos, ref: doc.ref, alt: doc.alt }, { $set: {
        exome: doc.exome,
        genome: doc.genome,
        transcripts: doc.transcripts
      } }, { upsert: true })
        .catch((err) => {
          console.error(err);
        });
    }
    return doc;
  });
};
exports.queryByVariant = queryByVariant;
