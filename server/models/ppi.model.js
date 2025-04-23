const mongoose = require('mongoose');

const ppiSchema = mongoose.Schema({
  biogridId: Number,
  source: {
    humanGeneId: String,
    entrezId: Number
  },
  interactor: {
    taxonId: Number,
    entrezId: Number,
    humanGeneId: String
  },
  ref: {
    pubmedId: String,
    author: String
  },
  exp: {
    name: String,
    type: String
  }
}, { collection: 'PPI' });

module.exports = mongoose.model('PPI', ppiSchema);
