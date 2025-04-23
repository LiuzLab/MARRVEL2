const mongoose = require('mongoose');

const impcPhenotypesSchema = mongoose.Schema({
  poId : {
    type: String,
    required: true
  },
  markerEntrezId: {
    type: Number,
    required: true
  },
  markerMgiId: {
    type: String,
    required: true
  },
  poName: String,
  alleleSymbol: String,
  lifeStage: String,
  sex: String,
  pValue: Number,
  zygosity: String
}, { collection: 'IMPCPhenotypes', toJSON: { virtuals: true } });

impcPhenotypesSchema.virtual('phenotype', {
  ref: 'POTerms',
  localField: 'poId',
  foreignField: 'id',
  justOne: true
});
impcPhenotypesSchema.virtual('gene', {
  ref: 'Genes',
  localField: 'markerEntrezId',
  foreignField: 'entrezId',
  justOne: true
});

module.exports = mongoose.model('IMPCPhenotypes', impcPhenotypesSchema);
