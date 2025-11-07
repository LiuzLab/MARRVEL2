const StringInteractions = require('../../models/string-interactions.model');
const Gene = require('../../models/genes.model');
const EnsemblGene = require('../../models/ensembl-gene.model');

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
      const gene = await Gene.findOne({ entrezId });
      if (!gene) {
        throw new Error(`Gene with Entrez ID ${entrezId} not found`);
      }
      if (!gene.xref?.ensemblId?.length) {
        console.log(`No Ensembl ID found for gene with Entrez ID ${entrezId}`);
        return [];
      }
      const ensemblGene = await EnsemblGene.findOne({ ensemblId: gene.xref.ensemblId });
      if (ensemblGene?.proteinIds?.length === 0) {
        return [];
      }
      const interactions = await StringInteractions
        .find({
          $or: [
            { ensemblId1: { $in: ensemblGene.proteinIds } },
            { ensemblId2: { $in: ensemblGene.proteinIds } }
          ]
        })
        .sort({ _id: 1 })
        .skip(start)
        .limit(limit);
      return interactions;
    } catch (error) {
      console.error('Error in stringInteractionsByEntrezId resolver:', error);
      throw error;
    }
  }
};

module.exports = stringResolvers;
