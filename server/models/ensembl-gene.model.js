const mongoose = require('mongoose');
const config = require('../config');

const ensemblGeneSchema = mongoose.Schema({
  ensemblId: {
    type: String,
    required: true
  },
  entrezId: Number,
  transcriptIds: [String],
  proteinIds: [String],
}, { collection: `EnsemblGene.${config.ensemblHumanGeneVersion}` });
module.exports = mongoose.model('EnsemblGene', ensemblGeneSchema);
