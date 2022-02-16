const mongoose = require('mongoose');

const dioptDomainsSchema = mongoose.Schema({
  entrezId: {
    type: Number,
    required: true
  },
  domains: [{
    name: {
      type: String,
      required: true
    },
    start: {
      type: String,
      required: true
    },
    end: {
      type: String,
      required: true
    },
    proteinId: String,
    externalId: String
  }]
}, { collection: 'DIOPTDomains', toJSON: { virtuals: true } });

module.exports = mongoose.model('DIOPTDomains', dioptDomainsSchema);
