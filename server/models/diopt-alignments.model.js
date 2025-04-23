const mongoose = require('mongoose');

const dioptAlignmentsSchema = mongoose.Schema({
  entrezId: {
    type: Number,
    required: true
  },
  data: Object
}, { collection: 'DIOPTAlignments', toJSON: { virtuals: true } });

dioptAlignmentsSchema.virtual('gene', {
  ref: 'Genes',
  localField: 'entrezId',
  foreignField: 'entrezId',
  justOne: true
});

module.exports = mongoose.model('DIOPTAlignments', dioptAlignmentsSchema);
