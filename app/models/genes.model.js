const mongoose = require('mongoose');

const geneSchema = mongoose.Schema({
  taxonId: {
    type: Number,
    required: true
  },
  entrezId: {
    type: Number,
    required: true
  },
  symbol: {
    type: String,
    required: true
  },
  hgncId: Number,
  alias: Array,
  name: String,
  locusType: String,
  status: String,
  clinVarIds: Array,
  xref: Object,
  gos: [{
    goId: {
      type: String,
      required: true
    },
    eviCode: String,
    date: String,
    assignedBy: String
  }],
  phenotypes: [{
    id: {
      type: String,
      required: true
    },
    eviCode: String
  }],
  dgvIds: [{
    type: mongoose.ObjectId,
    ref: 'DGV'
  }],
  geno2mpIds: [{
    type: mongoose.ObjectId,
    ref: 'Geno2MP'
  }]
}, { collection: 'Genes', toJSON: { virtuals: true } });

geneSchema.virtual('gos.ontology', {
  ref: 'GOs',
  localField: 'gos.goId',
  foreignField: 'id',
  justOne: true
});
geneSchema.virtual('phenotypes.ontology', {
  ref: 'POTerms',
  localField: 'phenotypes.id',
  foreignField: 'id',
  justOne: true
});
geneSchema.virtual('clinVar', {
  ref: 'ClinVar',
  localField: 'clinVarIds',
  foreignField: 'uid'
});
geneSchema.virtual('agrExpressions', {
  ref: 'AGRExpressions',
  localField: 'entrezId',
  foreignField: 'entrezId',
  justOne: true
});

module.exports = mongoose.model('Genes', geneSchema);
