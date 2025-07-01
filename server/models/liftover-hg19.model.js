const mongoose = require('mongoose');
const config = require('../config');

const colName = `Liftover.${config.liftover.hg19Version}-${config.liftover.hg38Version}`;

const liftoverSchema = mongoose.Schema({
  hg19Chr: {
    type: String,
    required: true
  },
  hg19Pos: {
    type: Number,
    required: true
  },
  hg38Chr: String,
  hg38Pos: Number
}, { collection: colName });

module.exports = mongoose.model(colName, liftoverSchema);

