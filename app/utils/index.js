exports.variant = require('./variant');
exports.gnomADAPI = require('./gnomADAPI');
exports.omimAPI = require('./omimAPI');

var moment = require('moment');

exports.isOlderThan = (date, days) => {
  date = moment(date);
  var now = moment();
  return (now.diff(date, 'days') > days);
};
