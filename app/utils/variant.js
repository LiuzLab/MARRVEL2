const Promise = require('bluebird');

const validateAndParseVariant = (varInput) => {
  const reExps = [
    /(?:chr|Chr)?([0-9]?[0-9XY])\s*:\s*([0-9]*)\s*([ACGT]*)\s*>\s*([ACGT]*)/,
    /([0-9]?[0-9XY])\s*-\s*([0-9]*)\s*-\s*([ACGT]*)\s*-\s*([ACGT]*)/,
    /.+_0*(\d+)\.\d+:.\.(\d+)([ACGT]*)>([ACGT]*)/
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
        pos: res[2],
        ref: res[3],
        alt: res[4]
      };
    }
  }
  return null;
}
exports.validateAndParseVariant = validateAndParseVariant;
