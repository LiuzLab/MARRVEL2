const mongoose = require('mongoose');

const pdbeSchema = mongoose.Schema({
  uniprotKBId: {
    type: String,
    required: true
  },
  pdbs: Number,
  ligands: Number,
  interactionPartners: Number,
  annotations: Number,
  similarProteins: Number,
  lastUpdate: Date,
}, { collection: 'PdbeSummaries', toJSON: { virtuals: true } });

module.exports = mongoose.model('PdbeSummaries', pdbeSchema);
