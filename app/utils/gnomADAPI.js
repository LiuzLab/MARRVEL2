const Promise = require('bluebird');
const rp = require('request-promise');

const queryByVariant = (variant) => {
  return rp({
    uri: 'http://gnomad-api.broadinstitute.org',
    qs: { query: '{\n' +
        '  variant(variantId: "' + variant + '", dataset: gnomad_r2_1) {\n' +
        '    alt\n' +
        '    chrom\n' +
        '    pos\n' +
        '    ref\n' +
        '    variantId\n' +
        '    ... on GnomadVariantDetails {\n' +
        '      exome {\n' +
        '        ac\n' +
        '        ac_hemi\n' +
        '        ac_hom\n' +
        '        an\n' +
        '      }\n' +
        '      genome {\n' +
        '        ac\n' +
        '        ac_hemi\n' +
        '        ac_hom\n' +
        '        an\n' +
        '      }\n' +
        '      rsid\n' +
        '      colocatedVariants\n' +
        '      sortedTranscriptConsequences {\n' +
        '        gene_id\n' +
        '        gene_symbol\n' +
        '        transcript_id\n' +
        '      }\n' +
        '    }\n' +
        '  }\n' +
        '}' },
    json: true
  }).then((res) => {
    if (res.data == null || res.data.variant == null) {
      return null;
    }
    else {
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
        transcripts: res.data.variant.sortedTranscriptConsequences
          .map((item) => {
            return {
              geneSymbol: item['gene_symbol'],
              geneEnsemblId: item['gene_id'],
              ensemblId: item['transcript_id'],
              proteinId: item['protein_id']
            };
          }),
        lastUpdate: new Date()
      };
    }
  });
};
exports.queryByVariant = queryByVariant;
