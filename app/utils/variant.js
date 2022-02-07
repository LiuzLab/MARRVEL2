const Promise = require('bluebird');

const validateAndParseVariant = (varInput) => {
  const reExps = [
    /(?:chr|Chr)?([0-9]?[0-9XY])\s*:\s*([0-9]*)\s*([ACGTU]*)\s*>\s*([ACGTU]*)/,
    /([0-9]?[0-9XY])\s*-\s*([0-9]*)\s*-\s*([ACGTU]*)\s*-\s*([ACGTU]*)/,
    /.+_0*(\d+)\.\d+:.\.(\d+)([ACGTU]*)>([ACGTU]*)/
  ];
  for (let i=0; i<reExps.length; ++i) {
    const reExp = reExps[i];
    const res = varInput.match(reExp);
    if (res) {
      const chr = parseInt(res[1]);
      if (chr < 1 || chr > 24) return null;
      if (res[1] === '23') res[1] = 'X';
      else if (res[1] === '24') res[1] = 'Y';
      return  {
        chr: res[1],
        pos: parseInt(res[2]),
        ref: res[3],
        alt: res[4]
      };
    }
  }
  return null;
}
exports.validateAndParseVariant = validateAndParseVariant;

const comp = {
  A: 'T',
  T: 'A',
  C: 'G',
  G: 'C'
};
exports.comp = comp;

exports.matchVariant = (v1, v2) => {
  return v1.chr === v2.chr && v1.pos === v2.pos &&
    (v1.ref === v2.ref && v1.alt === v2.alt || comp[v1.ref] === v2.ref && comp[v1.alt] === v2.alt);
}
