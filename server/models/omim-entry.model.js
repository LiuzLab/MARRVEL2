const mongoose = require('mongoose');

const omimEntrySchema = mongoose.Schema({
  prefix: String,
  mimNumber: {
    type: Number,
    required: true
  },
  title: String,
  alternativeTitles: [String],
  phenotypeMapExists: Boolean,
  phenotypeMapList: [{
    phenotypeMap: {
      geneIDs: String
    }
  }]
}, { collection: 'OMIMEntry' });

module.exports = mongoose.model('OMIMEntry', omimEntrySchema);
