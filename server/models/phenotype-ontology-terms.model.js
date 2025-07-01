/* eslint camelcase: 0 */
const mongoose = require('mongoose');

const potermsSchema = mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  name: String,
  def: String,
  namespace: String,
  taxonId: Number,
  is_a: [{
    type: String
  }],
  categories: [{
    id: Number,
    name: String
  }]
}, { collection: 'POTerms', toJSON: { virtuals: true } });

module.exports = mongoose.model('POTerms', potermsSchema);
