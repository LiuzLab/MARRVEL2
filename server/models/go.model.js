/* eslint camelcase: 0 */
const mongoose = require('mongoose');

const gosSchema = mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  name: String,
  synonyms: Array,
  is_a: [{
    type: String,
  }],
  namespace: String,
  def: String,
  agrSlimGoId: String,
}, { collection: 'GOs', toJSON: { virtuals: true } });

module.exports = mongoose.model('GOs', gosSchema);
