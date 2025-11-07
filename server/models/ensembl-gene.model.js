const mongoose = require('mongoose');

const ensemblGeneSchema = mongoose.Schema({
  ensemblId: {
    type: String,
    required: true
  },
  entrezId: Number,
  transcriptIds: [String],
  proteinIds: [String],
}, { collection: 'EnsemblGene.GRCh38.p14' });
module.exports = mongoose.model('EnsemblGene', ensemblGeneSchema);
