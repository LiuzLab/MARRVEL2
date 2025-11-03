const mongoose = require('mongoose');

const stringInteractionSchema = mongoose.Schema({
  ensemblId1: {
    type: String,
    required: true
  },
  ensemblId2: {
    type: String,
    required: true
  },
  experiments: {
    type: Number,
    required: true
  },
  database: {
    type: Number,
    required: true
  },
  combExpDb: {
    type: Number,
    required: true
  }
}, { collection: 'String.12.0' });

module.exports = mongoose.model('StringInteractions', stringInteractionSchema);
