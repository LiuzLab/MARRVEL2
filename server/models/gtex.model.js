const mongoose = require('mongoose');

const gtexSchema = mongoose.Schema({
  entrezId: Number,
  ensemblId: String,
  symbol: String,
  data: Object
}, { collection: 'GTExGeneTPMs' });

module.exports = mongoose.model('GTExGeneTPMs', gtexSchema);
