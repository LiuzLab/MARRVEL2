const mongoose = require('mongoose');

const omimPhenotypeSchema = mongoose.Schema({
  mimNumber: {
    type: Number,
    required: true
  },
  phenotype: {
    type: String,
    required: true
  },
  geneMimNumber: Number,
  phenotypeInheritance: String,
  phenotypeMappingKey: Number,
  phenotypicSeriesNumber: String,
  entrezId: Number,
}, {
  collection: 'OMIMPhenotype',
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

omimPhenotypeSchema.virtual('gene', {
  ref: 'Genes',
  localField: 'entrezId',
  foreignField: 'entrezId',
  justOne: true
});

module.exports = mongoose.model('OMIMPhenotype', omimPhenotypeSchema);
