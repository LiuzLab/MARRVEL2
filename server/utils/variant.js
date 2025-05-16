const Promise = require('bluebird');
const got = Promise.promisify(require('got'));

const validateAndParseVariant = (varInput) => {
  const reExps = [
    /(?:chr|Chr)?([0-9]?[0-9XY])\s*:(?:g\.)?\s*([0-9]*)\s*([ACGTU]*)\s*>\s*([ACGTU]*)/,
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
};

exports.liftover = (chr, pos, fromOrg, fromDb, toOrg, toDb, minMatch, isMultiRegionAllowed, minQuery, minChain, minBlocks, isThickFudgeSet) => {
  return new Promise((resolve, reject) => {
    got.get('https://genome.ucsc.edu/cgi-bin/hgLiftOver').then((res) => {
      const M = res.body.match(new RegExp(`\<input type=(?:(?:['"]hidden['"])|(?:hidden)) name=(?:(?:['"]hgsid['"])|(?:hgsid)) value=['"]([^'"]+)[^>]`, 'mi'));
      const payload = {
        hgsid: M[1],
        hglft_fromOrg: fromOrg,
        hglft_fromDb: fromDb,
        hglft_toOrg: toOrg,
        hglft_toDb: toDb,
        hglft_minMatch: minMatch || '0.95',
        'boolshad.hglft_multiple': isMultiRegionAllowed || '0',
        hglft_minSizeQ: minQuery || '0',
        hglft_minChainT: minChain || '0',
        hglft_minBlocks: minBlocks || '1',
        'boolshad.hglft_fudgeThick': isThickFudgeSet || '0',
        hglft_userData: 'chr' + chr + '\t' + pos + '\t' + pos
      };
      return got.post('https://genome.ucsc.edu/cgi-bin/hgLiftOver', { form: payload }).text();
    }).then((res) => {
      const M = res.match(new RegExp(`(..\/trash[^\ \>]+.bed)`, 'mi'));
      return M ? got.get('https://genome.ucsc.edu/cgi-bin/' + M[1]).text() : '';
    }).then((res) => {
      const lifted = (res.split('\n')[0] || '').split('\t');
      resolve({
        inputChr: chr,
        inputPos: pos,
        chr: lifted[0].replace('chr', ''),
        pos: parseInt(lifted[1])
      });
    }).catch((err) => {
      reject(err);
    });
  });
};

exports.getChromStr = (chrom) => {
  chrom = chrom.replace('chr', '').replace('Chr', '');
  switch (chrom) {
    case '23':
      return 'X';
    case '24':
      return 'Y';
    case 'MT':
      return 'M';
    default:
      return chrom;
  }
}
