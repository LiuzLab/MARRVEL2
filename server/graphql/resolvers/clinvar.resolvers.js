const db = require('../../utils/db');
const utils = require('../../utils');

/**
 * Find Clinvar variants by gene symbol
 */
const findByGeneSymbol = async ({ symbol }) => {
  try {
    return await db.clinvar.getByGeneSymbol(symbol);
  } catch (error) {
    console.error('Error fetching Clinvar by gene symbol:', error);
    throw new Error('Failed to fetch Clinvar data by gene symbol');
  }
};

/**
 * Find Clinvar variants by gene Entrez ID
 */
const findByGeneEntrezId = async ({ entrezId }) => {
  try {
    return await db.clinvar.getByGeneEntrezId(entrezId);
  } catch (error) {
    console.error('Error fetching Clinvar by gene Entrez ID:', error);
    throw new Error('Failed to fetch Clinvar data by gene Entrez ID');
  }
};

/**
 * Find Clinvar variant by specific variant
 */
const findByVariant = async ({ variant, build = 'hg19' }) => {
  try {
    const parsedVariant = utils.variant.validateAndParseVariant(variant);
    if (!parsedVariant) {
      throw new Error('Invalid variant format');
    }
    return await db.clinvar.getByVariant(parsedVariant, build);
  } catch (error) {
    console.error('Error fetching Clinvar by variant:', error);
    throw new Error('Failed to fetch Clinvar data by variant');
  }
};

/**
 * Get Clinvar variant counts by gene Entrez ID
 */
const getCountsByEntrezId = async ({ entrezId }) => {
  try {
    return await db.clinvar.getCountsByEntrezId(entrezId);
  } catch (error) {
    console.error('Error fetching Clinvar counts by Entrez ID:', error);
    throw new Error('Failed to fetch Clinvar counts by Entrez ID');
  }
};

module.exports = {
  findByGeneSymbol,
  findByGeneEntrezId,
  findByVariant,
  getCountsByEntrezId,
};
