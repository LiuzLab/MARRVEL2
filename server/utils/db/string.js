const config = require('../../config');
const ensembl = require('../ensembl');

const String = require('../../models/string.model');

const PRIOR = 0.041;  // Prior probability for STRING interactions

exports.getByEntrezId = async (eid) => {
  // Get Ensembl gene info by Entrez ID
  const genes = await ensembl.getEnsemblGeneByEntrezId(eid);
  if (genes.length === 0) {
    return [];
  } else if (genes.length > 1) {
    console.log(`Multiple genes found for entrezId ${eid}`);
  }
  const proteinIds = [];
  // Collect all protein IDs from the genes
  for (const gene of genes) {
    if (gene.proteinIds) {
      proteinIds.push(...gene.proteinIds);
    }
  }
  // Get unique protein IDs
  const uniqueProteinIds = [...new Set(proteinIds)];
  if (uniqueProteinIds.length === 0) {
    return [];
  } else if (uniqueProteinIds.length > 1) {
    console.log(`Multiple protein IDs found for entrezId ${eid}: ${uniqueProteinIds.join(', ')}`);
  }

  /*
  >>> exp = 0.370
>>> db = 0.900
>>> p = 0.041
... 
>>> exp_nop = (exp - p) / (1-p)
>>> db_nop = (db - p) / (1-p)
>>> tot_nop = 1 - (1 - exp_nop) * (1 - db_nop)
>>> tot = tot_nop + p * (1 - tot_nop)
>>> 
>>> tot
0.9343065693430658
>>> (2 - p) / (1-p )* (db+exp-p) - p / (1-p)
2.4677904066736187
>>> 
*/
  // Query the String database
  const ENSG_COL_NAME = `EnsemblGene.${config.ensemblGene}`;
  const interactions = await String.aggregate([
    { $match: { ensemblId1: { $in: uniqueProteinIds } } },
    { $project: {
      combinedScore: { $add: ['$combinedScore', PRIOR] },
    } },
    { $lookup: {
      from: ENSG_COL_NAME,
      localField: 'ensemblId1',
      foreignField: 'proteinIds',
      as: 'sourceEns'
    } },
    { $unwind: '$sourceEns' },
    { $lookup: {
      from: ENSG_COL_NAME,
      localField: 'ensemblId2',
      foreignField: 'proteinIds',
      as: 'interactorEns'
    } },
    { $unwind: '$interactorEns' },

    { $lookup: {
      from: 'Genes',
      localField: 'sourceEns.entrezId',
      foreignField: 'entrezId',
      as: 'source'
    } },
    { $unwind: '$source' },
    { $lookup: {
      from: 'Genes',
      localField: 'interactorEns.entrezId',
      foreignField: 'entrezId',
      as: 'interactor'
    } },
    { $unwind: '$interactor' },

    { $project: {
      experiments: 1,
      database: 1,
      'source.entrezId': 1,
      'source.symbol': 1,
      'source.proteinId': '$ensemblId1',
      'interactor.entrezId': 1,
      'interactor.symbol': 1,
      'interactor.proteinId': '$ensemblId2'
    } },
    { $lookup: {
      from: `String.${config.string}`,
      localField: 'interactor.proteinId',
      foreignField: 'ensemblId1',
      as: 'ppis'
    } },
    { $project: { '_id': 0, 'ppis._id': 0 } }
  ]);
  const result = interactions.map((interaction) => {
    interaction.interactor.ppis = interaction.ppis.map((e) => ({
      proteinId1: e.ensemblId1,
      proteinId2: e.ensemblId2,
      experiments: e.experiments,
      database: e.database
    }));
    delete interaction.ppis;
    return interaction;
  });
  return result;
};
