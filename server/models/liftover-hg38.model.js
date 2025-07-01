const mongoose = require('mongoose');
const config = require('../config');

const colName = `Liftover.${config.liftover.hg38Version}-${config.liftover.hg19Version}`;

const liftoverSchema = mongoose.Schema({
  hg38Chr: {
    type: String,
    required: true
  },
  hg38Pos: {
    type: Number,
    required: true
  },
  hg19Chr: String,
  hg19Pos: Number
}, { collection: colName });

module.exports = mongoose.model(colName, liftoverSchema);

