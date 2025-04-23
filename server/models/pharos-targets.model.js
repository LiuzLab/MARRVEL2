const mongoose = require('mongoose');

const pharosTargetsSchema = mongoose.Schema({
  id: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  gene: String,
  accession: String,
  structureRefId: {
    type: String,
    required: true
  },
  description: String,
  idgFamily: String,
  idgTDL: String,
  idgDevLevel: String,
  self: String,
  drugIds: {
    type: [Number],
    required: true
  },
  ligandIds: {
    type: [Number],
    required: true
  }
}, { collection: 'PharosTargets' });

pharosTargetsSchema.virtual('drugs', {
  ref: 'PharosDrugs',
  localField: 'drugIds',
  foreignField: 'id'
});

pharosTargetsSchema.virtual('ligands', {
  ref: 'PharosLigands',
  localField: 'ligandIds',
  foreignField: 'id'
});

module.exports = mongoose.model('PharosTargets', pharosTargetsSchema);

