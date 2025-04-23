const mongoose = require('mongoose');

const primateSchema = mongoose.Schema({
  chr: {
    type: String,
    required: true
  },
  pos: {
    type: Number,
    required: true
  },
  ref: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    require: true
  },
  END: Number,    // Stop position of the interval
  ABHet: Number,    // Allele Balance for heterozygous calls (ref/(ref+alt))
  ABHom: Number,    // Allele Balance for homozygous calls (A/(A+O)) where A is the allele (ref or alt) and O is anything other
  AC: Number,   // Allele count in genotypes, for each ALT allele, in the same order as listed
  AF: Number,   // Allele Frequency, for each ALT allele, in the same order as listed
  AN: Number,   // Total number of alleles in called genotypes
  BaseQRankSum: Number,   // Z-score from Wilcoxon rank sum test of Alt Vs. Ref base qualities
  DP: Number,   // Approximate read depth; some reads may have been filtered
  DS: Boolean,    // Were any of the samples downsampled?
  ExcessHet: Number,    // Phred-scaled p-value for exact test of excess heterozygosity
  FS: Number,   // Phred-scaled p-value using Fisher's exact test to detect strand bias
  InbreedingCoeff: Number,    // Inbreeding coefficient as estimated from the genotype likelihoods per-sample when compared against the Hardy-Weinberg expectation
  MLEAC: Number,    // Maximum likelihood expectation (MLE) for the allele counts (not necessarily the same as the AC), for each ALT allele, in the same order as listed
  MLEAF: Number,    // Maximum likelihood expectation (MLE) for the allele frequency (not necessarily the same as the AF), for each ALT allele, in the same order as listed
  MQ: Number,   // RMS Mapping Quality
  MQRankSum: Number,    // Z-score From Wilcoxon rank sum test of Alt vs. Ref read mapping qualities
  OND: Number,    // Overall non-diploid ratio (alleles/(alleles+non-alleles))
  QD: Number,   // Variant Confidence/Quality by Depth
  RAW_MQandDP: Number,    // Raw data (sum of squared MQ and total depth) for improved RMS Mapping Quality calculation. Incompatible with deprecated RAW_MQ formulation.
  ReadPosRankSum: Number,   // Z-score from Wilcoxon rank sum test of Alt vs. Ref read position bias
  ReverseComplementedAlleles: Boolean,    // The REF and the ALT alleles have been reverse complemented in liftover since the mapping from the previous reference to the current one was on the negative strand.
  SOR: Number,    // Symmetric Odds Ratio of 2x2 contingency table to detect strand bias
  SwappedAlleles: Boolean   // The REF and the ALT alleles have been swapped in liftover due to changes in the reference. It is possible that not all INFO annotations reflect this swap, and in the genotypes, only the GT, PL, and AD fields have been modified. You should check the TAGS_TO_REVERSE parameter that was used during the LiftOver to be sure.
}, { collection: 'Primate.hg19' });
module.exports = mongoose.model('primate', primateSchema);
