const liftover = require('../utils/variant').liftover;

const LiftoverModel38 = require('../models/liftover-hg38.model');
const LiftoverModel19 = require('../models/liftover-hg19.model');

exports.hg38ToHg19 = (req, res) => {
  const chr = (req.params.chr || '').replace('chr', '').replace('Chr', '');
  const pos = parseInt(req.params.pos);

  if (chr === '' || isNaN(pos)) {
    return res.status(404).send('Invalid input');
  }

  LiftoverModel38.findOne({ hg38Chr: chr, hg38Pos: pos })
    .lean()
    .then((doc) => {
      if (doc) {
        return { hg19Chr: doc.hg19Chr, hg19Pos: doc.hg19Pos };
      } else {
        return liftover(chr, pos, 'Human', 'hg38', 'Human', 'hg19')
          .then((result) => {
            LiftoverModel38.create({ hg38Chr: result.inputChr, hg38Pos: result.inputPos, hg19Chr: result.chr, hg19Pos: result.pos })
              .catch((err) => { console.log(err); });
            return { hg19Chr: result.chr, hg19Pos: result.pos };
          });
      }
    }).then((result) => {
      return res.json(result);
    }).catch((err) => {
      return res.status(500).end();
    });
};

exports.hg19ToHg38 = (req, res) => {
  const chr = (req.params.chr || '').replace('chr', '').replace('Chr', '');
  const pos = parseInt(req.params.pos);

  if (chr === '' || isNaN(pos)) {
    return res.status(404).send('Invalid input');
  }

  LiftoverModel19.findOne({ hg19Chr: chr, hg19Pos: pos })
    .lean()
    .then((doc) => {
      if (doc) {
        return { hg19Chr: doc.hg19Chr, hg38Pos: doc.hg38Pos };
      } else {
        return liftover(chr, pos, 'Human', 'hg19', 'Human', 'hg38')
          .then((result) => {
            LiftoverModel19.create({ hg19Chr: result.inputChr, hg19Pos: result.inputPos, hg38Chr: result.chr, hg38Pos: result.pos })
              .catch((err) => { console.log(err); });
            return { hg38Chr: result.chr, hg38Pos: result.pos };
          });
      }
    }).then((result) => {
      return res.json(result);
    }).catch((err) => {
      return res.status(500).end();
    });
};
