const mongoose = require('mongoose');
const config = require('../config');

const decipherSchema = mongoose.Schema({
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
  duplication: {
    std: Number,
    obs: Number,
    freq: Number
  },
  sampleSize: Number,
    delection: {
    std: Number,
    obs: Number,
    freq: Number
  },
  freq: Number,
  std: Number,
  obs: Number,
  cnvType: Number,
  study: String
}, { collection: config.decipher.control.name });
module.exports = mongoose.model(config.decipher.control.name, decipherSchema);

