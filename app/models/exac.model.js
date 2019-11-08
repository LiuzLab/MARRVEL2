const mongoose = require('mongoose');

const exacSchema = mongoose.Schema({
  chr: {
    type: String,
    required: true
  },
  pos: {
    type: Number,
    required: true
  },
  ref: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    require: true
  },
  alleleNum: Number,
  alleleCount: Number,
  homCount: Number
}, { collection: 'ExAC' });

module.exports = mongoose.model('ExAC', exacSchema);

