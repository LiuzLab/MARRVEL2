const Genes = require('../../models/genes.model');
const geneUtil = require('../../utils/gene');

/**
 * Find gene by symbol and taxon ID
 */
const findByGeneSymbol = async ({ symbol, taxonId }) => {
  try {
    return await geneUtil.getBySymbol(taxonId, symbol);
  } catch (error) {
    console.error('Error fetching gene by symbol:', error);
    throw new Error('Failed to fetch gene by symbol');
  }
};

/**
 * Find gene by Entrez ID
 */
const findByEntrezId = async ({ entrezId }) => {
  try {
    return await geneUtil.getByEntrezId(entrezId);
  } catch (error) {
    console.error('Error fetching gene by Entrez ID:', error);
    throw new Error('Failed to fetch gene by Entrez ID');
  }
};

/**
 * Find gene by HGNC ID
 */
const findByHgncId = async ({ hgncId }) => {
  try {
    return await geneUtil.getByHgncId(hgncId);
  } catch (error) {
    console.error('Error fetching gene by HGNC ID:', error);
    throw new Error('Failed to fetch gene by HGNC ID');
  }
};

/**
 * Find gene by Ensembl ID
 */
const findByEnsemblId = async ({ ensemblId }) => {
  try {
    const gene = await Genes.findOne(
      { 'xref.ensemblId': ensemblId },
      { _id: 0, clinVarIds: 0, dgvIds: 0, geno2mpIds: 0, gos: 0, phenotypes: 0 }
    ).lean();
    
    if (!gene) {
      return null;
    }

    // Convert alias to array if it's a string
    if (gene.alias && typeof gene.alias === 'string') {
      gene.alias = [gene.alias];
    }
    
    // Handle omimId format
    if (gene.xref && gene.xref.omimId && gene.xref.omimId.length) {
      gene.xref.omimId = gene.xref.omimId[0];
    }

    return gene;
  } catch (error) {
    console.error('Error fetching gene by Ensembl ID:', error);
    throw new Error('Failed to fetch gene by Ensembl ID');
  }
};

/**
 * Find genes by prefix search
 */
const findByPrefix = async ({ prefix, taxonId, limit = 30 }) => {
  try {
    const symbolRegex = new RegExp(
      `^(${prefix.trim().split(/[^a-zA-Z0-9]+/g).join('|')})`,
      taxonId === 7227 ? '' : 'i'
    );
    
    const genes = await Genes.find(
      { taxonId, symbol: symbolRegex },
      { _id: 0, clinVarIds: 0, gos: 0, dgvIds: 0, geno2mpIds: 0, phenotypes: 0 },
      { limit, sort: { symbol: 1 } }
    ).lean();

    return genes.map(gene => {
      if (gene.alias && typeof gene.alias === 'string') {
        gene.alias = [gene.alias];
      }
      return gene;
    });
  } catch (error) {
    console.error('Error fetching genes by prefix:', error);
    throw new Error('Failed to fetch genes by prefix');
  }
};

/**
 * Find genes by genomic location
 */
const findByGenomicLocation = async ({ chr, posStart, posStop, build = 'hg19' }) => {
  try {
    return await geneUtil.getByGenomicLocation(chr, posStart, posStop, build);
  } catch (error) {
    console.error('Error fetching genes by genomic location:', error);
    throw new Error('Failed to fetch genes by genomic location');
  }
};

module.exports = {
  findByGeneSymbol,
  findByEntrezId,
  findByHgncId,
  findByEnsemblId,
  findByPrefix,
  findByGenomicLocation,
};
