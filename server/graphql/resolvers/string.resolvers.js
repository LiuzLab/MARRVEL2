const StringInteractions = require('../../models/string-interactions.model');
const EnsemblGene = require('../../models/ensembl-gene.model');

const config = require('../../config');

/**
 * String GraphQL resolvers
 */
const stringResolvers = {
  stringInteractionsByEnsemblProteinId: async (args) => {
    try {
      const { ensemblId, limit = 100, start = 0 } = args;
      // Find all STRING interactions where ensemblId1 matches the provided ensemblId
      const interactions = await StringInteractions
        .find({ ensemblId1: ensemblId })
        .sort({ _id: 1 })
        .skip(start)
        .limit(limit);
      return interactions;
    } catch (error) {
      console.error('Error in stringInteractionsByEnsemblId resolver:', error);
      throw error;
    }
  },

  stringInteractionBetweenProteins: async (args) => {
    try {
      const { ensemblId1, ensemblId2 } = args;
      // Find the specific interaction between two genes (bidirectional search)
      const interaction = await StringInteractions.findOne({ ensemblId1, ensemblId2 });
      if (interaction) {
        return interaction;
      }
      const reverseInteraction = await StringInteractions
        .findOne({ ensemblId1: ensemblId2, ensemblId2: ensemblId1 });
      return reverseInteraction;
    } catch (error) {
      console.error('Error in stringInteractionBetweenProteins resolver:', error);
      throw error;
    }
  },

  stringInteractionsByEntrezId: async (args) => {
    try {
      const { entrezId, limit = 100, start = 0 } = args;
      const interactions = await EnsemblGene.aggregate([
        { $match: { entrezId } },
        { $unwind: '$proteinIds' },
        {
          $lookup: {
            from: `String.${config.stringVersion}`,
            localField: 'proteinIds',
            foreignField: 'ensemblId1',
            as: 'interactions'
          }
        },
        { $unwind: '$interactions' },
        { $sort: { 'interactions._id': 1 } },
        { $skip: start },
        { $limit: limit },
        { $project: {
          _id: '$interactions._id',
          ensemblId1: '$interactions.ensemblId1',
          ensemblId2: '$interactions.ensemblId2',
          experiments: '$interactions.experiments',
          database: '$interactions.database',
          combExpDb: '$interactions.combExpDb'
        } },
        { $lookup: {
          from: `EnsemblGene.${config.ensemblHumanGeneVersion}`,
          localField: 'ensemblId1',
          foreignField: 'proteinIds',
          as: 'ensemblGene1'
        } },
        { $unwind: '$ensemblGene1' },
        { $lookup: {
          from: 'Genes',
          localField: 'ensemblGene1.entrezId',
          foreignField: 'entrezId',
          as: 'gene1'
        } },
        { $unwind: '$gene1' },
        { $lookup: {
          from: `EnsemblGene.${config.ensemblHumanGeneVersion}`,
          localField: 'ensemblId2',
          foreignField: 'proteinIds',
          as: 'ensemblGene2'
        } },
        { $unwind: '$ensemblGene2' },
        { $lookup: {
          from: 'Genes',
          localField: 'ensemblGene2.entrezId',
          foreignField: 'entrezId',
          as: 'gene2'
        } },
        { $unwind: '$gene2' },
        { $group: {
          _id: '$_id',
          ensemblId1: { $first: '$ensemblId1' },
          ensemblId2: { $first: '$ensemblId2' },
          experiments: { $first: '$experiments' },
          database: { $first: '$database' },
          combExpDb: { $first: '$combExpDb' },
          gene1: { $push: '$gene1' },
          gene2: { $push: '$gene2' }
        } }
      ]);
      return interactions;
    } catch (error) {
      console.error('Error in stringInteractionsByEntrezId resolver:', error);
      throw error;
    }
  }
};

module.exports = stringResolvers;
