const Genes = require('../../models/genes.model');
const PharosTargets = require('../../models/pharos-targets.model');
const PharosDrugs = require('../../models/pharos-drugs.model');
const PharosLigands = require('../../models/pharos-ligands.model');

/**
 * Pharos GraphQL resolvers
 */
const pharosResolvers = {
  // Root query resolvers
  pharosTargetById: async (args) => {
    try {
      const target = await PharosTargets.findOne({ id: args.id });
      if (!target) {
        throw new Error(`PharosTarget with id ${args.id} not found`);
      }
      return target;
    } catch (error) {
      console.error('Error in pharosTargetById resolver:', error);
      throw error;
    }
  },

  pharosTargetsByIds: async (args) => {
    try {
      const { ids, limit = 100, start = 0 } = args;
      
      if (ids.length === 0) {
        return [];
      }

      const targets = await PharosTargets
        .find({ id: { $in: ids } })
        .skip(start)
        .limit(limit);
      
      return targets;
    } catch (error) {
      console.error('Error in pharosTargetsByIds resolver:', error);
      throw error;
    }
  },

  pharosTargetsByGeneEntrezId: async (args) => {
    try {
      const { entrezId, limit = 100, start = 0 } = args;
      
      // Use the existing controller logic to get targets by gene
      const gene = await Genes.findOne({ entrezId });
      if (!gene || !gene.pharosTargetIds || gene.pharosTargetIds.length === 0) {
        return [];
      }

      const targets = await PharosTargets
        .find({ id: { $in: gene.pharosTargetIds } })
        .skip(start)
        .limit(limit);

      return targets;
    } catch (error) {
      console.error('Error in pharosTargetsByGeneEntrezId resolver:', error);
      throw error;
    }
  },

  // Type field resolvers
  PharosTarget: {
    drugs: async (parent) => {
      try {
        if (!parent.drugIds || parent.drugIds.length === 0) {
          return [];
        }
        
        const drugs = await PharosDrugs.find({
          id: { $in: parent.drugIds }
        });
        
        return drugs;
      } catch (error) {
        console.error('Error resolving PharosTarget.drugs:', error);
        return [];
      }
    },

    ligands: async (parent) => {
      try {
        if (!parent.ligandIds || parent.ligandIds.length === 0) {
          return [];
        }
        
        const ligands = await PharosLigands.find({
          id: { $in: parent.ligandIds }
        });
        
        return ligands;
      } catch (error) {
        console.error('Error resolving PharosTarget.ligands:', error);
        return [];
      }
    }
  }
};

module.exports = pharosResolvers;
