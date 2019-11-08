const mongoose = require('mongoose');

const omimSchema = mongoose.Schema({
  mimNumber: {
    type: Number,
    required: true
  },
  title: String,
  description: String,
  status: String,
  phenotypes: Array,
  allelicVariants: Array,
  lastUpdate: Date,
  __v: {
    type: Number,
    select: false
  }
}, { collection: 'OMIM' });

module.exports = mongoose.model('OMIM', omimSchema);
