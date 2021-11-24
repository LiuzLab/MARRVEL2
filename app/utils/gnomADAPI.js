const Promise = require('bluebird');
const got = Promise.promisify(require('got'));

const GnomAD = require('../models/gnomAD.model');
const GnomADGene = require('../models/gnomADGene.model');

const queryByGene = (gene) => {
  return new Promise((resolve, reject) => {
    if (!gene.entrezId || !gene.symbol && (!gene.xref || !gene.xref.ensemblId)) {
      resolve(null);
    } else {
      const geneFilter = gene.xref && gene.xref.ensemblId ?
        `gene_id: "${ gene.xref.ensemblId }"` :
        `gene_symbol: "${ gene.symbol }"`;
      got.post('https://gnomad.broadinstitute.org/api/', { json:
        { query: 'query Gene {\n' +
            `  gene(${ geneFilter }, reference_genome: GRCh37) {\n` +
            '    gene_id\n' +
            '    symbol\n' +
            '    flags\n' +
            '    gnomad_constraint {\n' +
            '      exp_lof\n' +
            '      exp_mis\n' +
            '      exp_syn\n' +
            '      obs_lof\n' +
            '      obs_mis\n' +
            '      obs_syn\n' +
            '      oe_lof\n' +
            '      oe_lof_lower\n' +
            '      oe_lof_upper\n' +
            '      oe_mis\n' +
            '      oe_mis_lower\n' +
            '      oe_mis_upper\n' +
            '      oe_syn\n' +
            '      oe_syn_lower\n' +
            '      oe_syn_upper\n' +
            '      lof_z\n' +
            '      mis_z\n' +
            '      syn_z\n' +
            '      pLI\n' +
            '      flags\n' +
            '    }\n' +
            '  }\n' +
            '}\n'
        }
      }).json().then((doc) => {
        doc = doc || {};
        doc.data = doc.data || {};
        doc.data.gene = doc.data.gene || {};
        doc.data.gene.gnomad_constraint = doc.data.gene.gnomad_constraint || {};
        return {
          entrezId: gene.entrezId,
          ensemblId: doc.data.gene.gene_id,
          symbol: doc.data.gene.symbol,
          mis: {
            obs: doc.data.gene.gnomad_constraint.obs_mis,
            z: doc.data.gene.gnomad_constraint.mis_z,
            exp: doc.data.gene.gnomad_constraint.exp_mis,
            oe: doc.data.gene.gnomad_constraint.oe_mis,
            oeLower: doc.data.gene.gnomad_constraint.oe_mis_lower,
            oeUpper: doc.data.gene.gnomad_constraint.oe_mis_upper,
          },
          syn: {
            obs: doc.data.gene.gnomad_constraint.obs_syn,
            z: doc.data.gene.gnomad_constraint.syn_z,
            exp: doc.data.gene.gnomad_constraint.exp_syn,
            oe: doc.data.gene.gnomad_constraint.oe_syn,
            oeLower: doc.data.gene.gnomad_constraint.oe_syn_lower,
            oeUpper: doc.data.gene.gnomad_constraint.oe_syn_upper,
          },
          lof: {
            obs: doc.data.gene.gnomad_constraint.obs_lof,
            z: doc.data.gene.gnomad_constraint.lof_z,
            exp: doc.data.gene.gnomad_constraint.exp_lof,
            oe: doc.data.gene.gnomad_constraint.oe_lof,
            oeLower: doc.data.gene.gnomad_constraint.oe_lof_lower,
            oeUpper: doc.data.gene.gnomad_constraint.oe_lof_upper,
            pLI: doc.data.gene.gnomad_constraint.pLI,
          },
          flags: doc.data.gene.flags,
          lastUpdate: new Date()
        };
      }).then((doc) => {
        GnomADGene.replaceOne({ entrezId: doc.entrezId }, doc, { upsert: true })
          .catch((err) => {
            console.error(err);
          });
        resolve(doc);
      }).catch((err) => {
        reject(err);
      });
    }
  });
};
exports.queryByGene = queryByGene;

const queryByVariant = (variant) => {
  return got.post('https://gnomad.broadinstitute.org/api/',
    { json: { query: '{\n' +
      '  variant(variantId: "' + variant + '", dataset: gnomad_r2_1) {\n' +
      '    chrom\n' +
      '    pos\n' +
      '    ref\n' +
      '    alt\n' +
      '    exome {\n' +
      '      ac\n' +
      '      an\n' +
      '      ac_hemi\n' +
      '      ac_hom\n' +
      '      filters\n' +
      '    }\n' +
      '    genome {\n' +
      '      ac\n' +
      '      an\n' +
      '      ac_hemi\n' +
      '      ac_hom\n' +
      '      filters\n' +
      '    }\n' +
      '    transcript_consequences {\n' +
      '      gene_id\n' +
      '      gene_symbol\n' +
      '      transcript_id\n' +
      '    }\n' +
      '  }\n' +
      '}\n'
    } }
  ).json().then((res) => {
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
        transcripts: res.data.variant.transcript_consequences
          .map((item) => {
            return {
              geneSymbol: item['gene_symbol'],
              geneEnsemblId: item['gene_id'],
              ensemblId: item['transcript_id'],
            };
          }),
        lastUpdate: new Date()
      };
    }
  }).then((doc) => {
    if (doc) {
      GnomAD.replaceOne({ chr: doc.chr, pos: doc.pos, ref: doc.ref, alt: doc.alt }, doc, { upsert: true })
        .catch((err) => {
          console.error(err);
        });
    }
    return doc;
  });
};
exports.queryByVariant = queryByVariant;
