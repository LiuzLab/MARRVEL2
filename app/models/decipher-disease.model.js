const mongoose = require('mongoose');

const decipherDiseaseSchema = mongoose.Schema({
  patientId : String,
  hg19Chr: {
    type: String,
    required: true
  },
  hg19Start: {
    type: Number,
    required: true
  },
  hg19Stop: {
    type: Number,
    required: true
  },
  ref: String,
  alt: String,
  cnvType: Number,
  transcript: String,
  geneSymbol: String,
  genotype: String,
  inheritance: String,
  pathogenicity: String,
  contribution: String,
  from: String,
  phenotypes: [{
    id: {
      type: String,
      required: true
    }
  }]
}, { collection: 'DECIPHERDisease' });

decipherDiseaseSchema.virtual('phenotypes.ontology', {
  ref: 'POTerms',
  localField: 'phenotypes.id',
  foreignField: 'id',
  justOne: true
});

module.exports = mongoose.model('DECIPHERDisease', decipherDiseaseSchema);

