const mongoose = require('mongoose');

const dioptOrthologSchema = mongoose.Schema({
  taxonId1: {
    type: Number,
    required: true
  },
  entrezId1: {
    type: Number,
    required: true
  },
  taxonId2: {
    type: Number,
    required: true
  },
  entrezId2: {
    type: Number,
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  bestScore: {
    type: Boolean,
    required: true
  },
  bestScoreRev: Boolean,
  confidence: {
    type: String,
    required: true
  }
}, { collection: 'DIOPTOrtholog', toJSON: { virtuals: true } });

dioptOrthologSchema.virtual('gene2', {
  ref: 'Genes',
  localField: 'entrezId2',
  foreignField: 'entrezId',
  justOne: true
});
dioptOrthologSchema.virtual('gene1', {
  ref: 'Genes',
  localField: 'entrezId1',
  foreignField: 'entrezId',
  justOne: true
});

module.exports = mongoose.model('DIOPTOrtholog', dioptOrthologSchema);
