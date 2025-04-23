exports.variant = require('./variant');
exports.gnomADAPI = require('./gnomADAPI');
exports.omimAPI = require('./omimAPI');
exports.ppi = require('./ppi');

var moment = require('moment');

exports.isOlderThan = (date, days) => {
  date = moment(date);
  var now = moment();
  return (now.diff(date, 'days') > days);
};

exports.getMedianFromSortedArr = (arr, leftIdx, rightIdx) => {
  leftIdx = leftIdx || 0;
  rightIdx = rightIdx || arr.length - 1;
  const len = rightIdx - leftIdx + 1;
  if (len == 1) {
    return +arr[leftIdx];
  }
  if (len % 2) {
    return +arr[leftIdx + Math.floor(len / 2)];
  }
  return (+arr[leftIdx + len / 2 - 1] + (+arr[leftIdx + len / 2])) / 2;
};
