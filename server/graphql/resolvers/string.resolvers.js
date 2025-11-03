const StringInteractions = require('../../models/string-interactions.model');

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
  }
};

module.exports = stringResolvers;
