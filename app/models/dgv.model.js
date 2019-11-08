const mongoose = require('mongoose');

const dgvSchema = mongoose.Schema({
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
  subType : String,
  accession : String,
  type : String,
  reference : String,
  method : String,
  platform : String,
  mergedVariants : String,
  supportingVariants : String,
  mergedOrSample : String,
  frequency : Number,
  sampleSize : Number,
  gain: Number,
  loss : Number,
  cohortDescription : String,
  samples : [{
    type: String
  }],
  "genes" : [{
    type: mongoose.ObjectId,
    ref: 'Genes'
  }]
}, { collection: 'DGV' });

module.exports = mongoose.model('DGV', dgvSchema);

