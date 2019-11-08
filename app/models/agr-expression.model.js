const mongoose = require('mongoose');

const agrExpressionSchema = mongoose.Schema({
  entrezId: {
    type: Number,
    required: true
  },
  expressionSummary: {
    totalAnnotations: Number,
    groups: [{
      name: String,
      totalAnnotations: Number,
      terms: [{
        id: String,
        name: String,
        numberOfAnnotations: Number
      }]
    }]
  }
}, { collection: 'AGRExpressions', toJSON: { virtuals: true } });

module.exports = mongoose.model('AGRExpressions', agrExpressionSchema);
