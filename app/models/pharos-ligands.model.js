const mongoose = require('mongoose');

const pharosLigandsSchema = mongoose.Schema({
  id: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: String,
  self: String,
  namespace: String,
  structureRefId: String,
  idgDevLevel: String
}, { collection: 'PharosLigands' });

module.exports = mongoose.model('PharosLigands', pharosLigandsSchema);

