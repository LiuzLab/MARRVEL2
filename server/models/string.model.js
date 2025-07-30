const mongoose = require('mongoose');

const config = require('../config');
const COL_NAME = `String.${config.string}`;

const stringSchema = mongoose.Schema(
  {
    ensemblId1: {
      type: String,
      required: true,
    },
    ensemblId2: {
      type: String,
      required: true,
    },
    experiments: Number,
    database: Number,
  },
  { collection: COL_NAME }
);

module.exports = mongoose.model(COL_NAME, stringSchema);
