const mongoose = require('mongoose');

const smartDomainsSchema = mongoose.Schema({
  entrezId: {
    type: Number,
    required: true
  },
  idx: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  type: String,
  start: Number,
  end: Number,
  eValue: Number,
  seq: String,
  shape: {
    shape: String,
    fill: String,
    textColor: String,
  }
}, { collection: 'SMARTDomains', toJSON: { virtuals: true } });

smartDomainsSchema.virtual('gene', {
  ref: 'Genes',
  localField: 'entrezId',
  foreignField: 'entrezId',
  justOne: true
});

module.exports = mongoose.model('SMARTDomains', smartDomainsSchema);
