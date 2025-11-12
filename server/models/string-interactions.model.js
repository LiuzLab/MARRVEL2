const mongoose = require('mongoose');
const config = require('../config');

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
}, { collection: `String.${config.stringVersion}` });

module.exports = mongoose.model('StringInteractions', stringInteractionSchema);
