const mongoose = require('mongoose');

const clinVarSchema = mongoose.Schema({
  chr: {
    type: String,
    required: true
  },
  start: {
    type: Number,
    required: true
  },
  stop: {
    type: Number,
    required: true
  },
  ref: String,
  alt: String,
  uid: Number,
  condition: String,
  title: String,
  significance: Object,
  band: String
}, { collection: 'ClinVar' });
module.exports = mongoose.model('ClinVar', clinVarSchema);
