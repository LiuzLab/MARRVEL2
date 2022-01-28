const Promise = require('bluebird');

const dbNSFP = require('../../models/dbNSFP.model');

const splitAndGetFirstNoneNull = (S) => {
  var L = S.split(';');
  for (var i=0; i<L.length; ++i) {
    if (L[i] !== '.') return L[i];
  }
  return '.';
};

exports.getByVariant = (variant, build) => {
  return new Promise((resolve, reject) => {
    if (variant === null) reject('Invalid variant');

    const query = build === 'hg38' ?
      { hg38Chr: variant.chr, hg38Pos: variant.pos, ref: variant.ref, alt: variant.alt } :
      { hg19Chr: variant.chr, hg19Pos: parseInt(variant.pos), ref: variant.ref, alt: variant.alt };
    dbNSFP.findOne(query, { '_id': 0 })
      .lean()
      .then((doc) => {
        if (!doc) resolve(null);
        else {
          for (var key in doc.scores) {
            if (doc.scores[key].score) {
              if ((typeof doc.scores[key].score) === 'string') {
                if (doc.scores[key].score.indexOf(';') !== -1) {
                  doc.scores[key].score = splitAndGetFirstNoneNull(doc.scores[key].score);
                }
              }
              doc.scores[key].score = (doc.scores[key].score !== '.' ? parseFloat(doc.scores[key].score) : null);
            }
            if (doc.scores[key].prediction) {
              var preds = doc.scores[key].prediction;
              if ((typeof preds) === 'string') {
                if (preds.indexOf(';') !== -1) {
                  doc.scores[key].prediction = splitAndGetFirstNoneNull(preds);
                }
              } else if (preds.length) {
                for (var i=0; i<preds.length; ++i) {
                  if (preds[i] !== '.') {
                    doc.scores[key].prediction = preds[i];
                    break;
                  }
                }
              }
              doc.scores[key].prediction = (doc.scores[key].prediction !== '.' ? doc.scores[key].prediction : null);
            }
            if (doc.scores[key].rawScore) {
              doc.scores[key].rawScore = (doc.scores[key].rawScore !== '.' ? parseFloat(doc.scores[key].rawScore) : null);
            }
            if (doc.scores[key].rankscore) {
              doc.scores[key].rankscore = (doc.scores[key].rankscore !== '.' ? parseFloat(doc.scores[key].rankscore) : null);
            }
          }
          resolve(doc);
        }
      }).catch((err) => {
        reject(err);
      });
  });
};

