const DbNSFP = require('../../models/dbNSFP.model');

/**
 * dbNSFP GraphQL resolvers
 */
const dbnsfpResolvers = {
  // Root query resolvers
  dbnsfpByVariant: async (args) => {
    try {
      const { chr, pos, ref, alt, build } = args;
      let query = {};
      if (build === 'hg19') {
        query = { hg19Chr: chr, hg19Pos: pos, ref, alt };
      } else if (build === 'hg38') {
        query = { hg38Chr: chr, hg38Pos: pos, ref, alt };
      } else {
        throw new Error(`Unsupported build: ${build}. Use 'hg19' or 'hg38'`);
      }

      const variant = await DbNSFP.findOne(query);
      return variant;
    } catch (error) {
      console.error('Error in dbnsfpByVariant resolver:', error);
      throw error;
    }
  },

  dbnsfpByPosition: async (args) => {
    try {
      const { chr, pos, build, limit = 100, start = 0 } = args;
      let query = {};
      if (build === 'hg19') {
        query = { hg19Chr: chr, hg19Pos: pos };
      } else if (build === 'hg38') {
        query = { hg38Chr: chr, hg38Pos: pos };
      } else {
        throw new Error(`Unsupported build: ${build}. Use 'hg19' or 'hg38'`);
      }
      const variants = await DbNSFP
        .find(query)
        .skip(start)
        .limit(limit);
      return variants;
    } catch (error) {
      console.error('Error in dbnsfpByPosition resolver:', error);
      throw error;
    }
  }
};

module.exports = dbnsfpResolvers;
