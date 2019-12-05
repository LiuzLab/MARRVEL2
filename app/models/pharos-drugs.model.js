const mongoose = require('mongoose');

const pharosDrugsSchema = mongoose.Schema({
  id: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: String,
  self: String,
  namespace: String,
  structureRefId: String,
  idgDevLevel: String
}, { collection: 'PharosDrugs' });

module.exports = mongoose.model('PharosDrugs', pharosDrugsSchema);

