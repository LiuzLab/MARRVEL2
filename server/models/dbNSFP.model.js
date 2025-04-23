const mongoose = require('mongoose');

const dbNSFPSchema = mongoose.Schema({
  hg19Chr: {
    type: String,
    required: true
  },
  hg19Pos: {
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
  scores: {
    type: Object,
    require: true
  },
  hg18Chr: String,
  hg18Pos: Number,
  hg38Chr: String,
  hg38Pos: Number,
  aaPos: Number,
  aaRef: String,
  aaAlt: String,
  rsid: String,
  ensemblId: String,
  transcriptEnsemblId: String,
  proteinEnsemblId: String,
  symbol: String
}, { collection: 'DbNSFP' });
module.exports = mongoose.model('DbNSFP', dbNSFPSchema);
