const Promise = require('bluebird')
const PPI = require('../models/ppi.model');

exports.getGroupedPpi = (entrezId, populateSource) => {
  return new Promise((resolve, reject) => {
    let aggPipe = [
      { '$match': { 'source.entrezId': entrezId } },
      { $unwind: '$interactor' },
      { $group: {
        _id: '$interactor.entrezId',
        source: { $mergeObjects: '$source' },
        interactor: { $mergeObjects: '$interactor' },
        evidences: { $push: {
          ref: '$ref',
          exp: '$exp'
        } }
      } },
      { $unwind: '$source' }
    ];
    if (populateSource) {
      aggPipe = [...aggPipe,
        { $lookup: {
          from: 'Genes',
          localField: 'source.entrezId',
          foreignField: 'entrezId',
          as: 'source'
        } },
        { $unwind: '$source' },
        { $project: {
          'source.entrezId': 1,
          'source.symbol': 1,
          interactor: 1,
          evidences: 1
        } }
      ];
    }
    aggPipe = [...aggPipe,
      { $lookup: {
        from: 'Genes',
        localField: 'interactor.entrezId',
        foreignField: 'entrezId',
        as: 'interactor'
      } },
      { $unwind: '$interactor' },
      { $project: {
        _id: 0,
        'source.entrezId': 1,
        'source.symbol': 1,
        'interactor.entrezId': 1,
        'interactor.symbol': 1,
        evidences: 1
      } }];
    PPI.aggregate(aggPipe).then((res) => {
      resolve(res);
    }).catch((err) => {
      reject(err);
    });
  });
};

exports.string = require('./db/string');
