const mongoose = require('mongoose');

const config = require('../config');
const COL_NAME = `EnsemblGene.${config.ensemblGene}`;

const stringSchema = mongoose.Schema(
  {
    ensemblId: {
      type: String,
      required: true,
    },
    transcriptIds: [String],
    proteinIds: [String],
    entrezId: Number
  },
  { collection: COL_NAME }
);

module.exports = mongoose.model(COL_NAME, stringSchema);
