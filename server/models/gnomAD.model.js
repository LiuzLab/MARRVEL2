const mongoose = require('mongoose');
const config = require('../config');

const gnomADSchema = mongoose.Schema({
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
  exome: Object,
  genome: Object,
  transcripts: Array,
  lastUpdate: Date,
  __v: {
    type: Number,
    select: false
  }
}, { collection: config.gnomad.variant.name });
module.exports = mongoose.model('GnomAD', gnomADSchema);
