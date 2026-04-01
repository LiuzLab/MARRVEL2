const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const config = require('../config');

const gnomADGeneSchema = mongoose.Schema({
  geneId: {
    type: ObjectId,
    require: true
  },
  ensemblId: String,
  lof: Object,
  mis: Object,
  syn: Object,
  entrezId: Number,
  lastUpdate: Date,
  __v: {
    type: Number,
    select: false
  }
}, { collection: config.gnomad.gene.name });
module.exports = mongoose.model('GnomADGene', gnomADGeneSchema);
