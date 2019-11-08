const mongoose = require('mongoose');

const geno2mpSchema = mongoose.Schema({
  hg19Chr: {
    type: String,
    required: true
  },
  hg19Pos: {
    type: Number,
    required: true
  },
  ref: {
    type: String,
    required: true,
  },
  alt: {
    type: String,
    required: true,
  },
  homCount: Number,
  hetCount: Number,
  hpoCount : Number,
  funcAnno: String,
  hpoProfiles: [{
    narrow: {
      hpoId: String,
      hpoTerm: String,
    },
    medium: {
      hpoId: String,
      hpoTerm: String,
    },
    broad : {
      hpoId : String,
      hpoTerm : String,
    },
    affectedStatus : String
  }],
  genes: [{
    type: mongoose.ObjectId,
    ref: 'Genes'
  }],
  hgvsCdnaChange : String
}, { collection: 'Geno2MP' });

module.exports = mongoose.model('Geno2MP', geno2mpSchema);

