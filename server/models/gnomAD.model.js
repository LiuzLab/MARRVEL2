const mongoose = require('mongoose');
const config = require('../config');

const gnomADSchema = mongoose.Schema({
  chr: {
    type: String,
  },
  hg38Chr: {
    type: String,
  },
  pos: {
    type: Number,
  },
  hg38Pos: {
    type: Number,
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
}, { collection: config.gnomad.variant.name });
module.exports = mongoose.model('GnomAD', gnomADSchema);
