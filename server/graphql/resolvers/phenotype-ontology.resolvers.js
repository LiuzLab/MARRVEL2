const PhenotypeOntologyTerms = require('../../models/phenotype-ontology-terms.model');
const Genes = require('../../models/genes.model');

/**
 * Find phenotype ontology term by PO ID
 */
const findByPoId = async ({ poId }) => {
  try {
    return await PhenotypeOntologyTerms.findOne({ id: poId }, { _id: 0 }).lean();
  } catch (error) {
    console.error('Error fetching phenotype ontology by PO ID:', error);
    throw new Error('Failed to fetch phenotype ontology by PO ID');
  }
};

/**
 * Find phenotype ontology terms by name search
 */
const findByName = async ({ name, limit = 50, start = 0 }) => {
  try {
    const nameRegex = new RegExp(name, 'i');
    return await PhenotypeOntologyTerms.find(
      { name: nameRegex },
      { _id: 0 },
      { limit, skip: start, sort: { id: 1 } }
    ).lean();
  } catch (error) {
    console.error('Error fetching phenotype ontology by name:', error);
    throw new Error('Failed to fetch phenotype ontology by name');
  }
};

/**
 * Find phenotype ontology terms by taxon ID
 */
const findByTaxonId = async ({ taxonId, limit = 100, start = 0 }) => {
  try {
    return await PhenotypeOntologyTerms.find(
      { taxonId },
      { _id: 0 },
      { limit, skip: start, sort: { id: 1 } }
    ).lean();
  } catch (error) {
    console.error('Error fetching phenotype ontology by taxon ID:', error);
    throw new Error('Failed to fetch phenotype ontology by taxon ID');
  }
};

/**
 * Find phenotype ontology terms by namespace
 */
const findByNamespace = async ({ namespace, limit = 100, start = 0 }) => {
  try {
    return await PhenotypeOntologyTerms.find(
      { namespace },
      { _id: 0 },
      { limit, skip: start, sort: { id: 1 } }
    ).lean();
  } catch (error) {
    console.error('Error fetching phenotype ontology by namespace:', error);
    throw new Error('Failed to fetch phenotype ontology by namespace');
  }
};

/**
 * Find phenotype ontology terms by category
 */
const findByCategory = async ({ categoryId, limit = 100, start = 0 }) => {
  try {
    return await PhenotypeOntologyTerms.find(
      { 'categories.id': categoryId },
      { _id: 0 },
      { limit, skip: start, sort: { id: 1 } }
    ).lean();
  } catch (error) {
    console.error('Error fetching phenotype ontology by category:', error);
    throw new Error('Failed to fetch phenotype ontology by category');
  }
};

/**
 * Find both gene ontology and phenotype ontology terms by gene Entrez ID
 */
const findByEntrezId = async ({ entrezId }) => {
  try {
    const gene = await Genes.findOne({ entrezId }, '-_id phenotypes')
      .populate('phenotypes.ontology');
    return gene.phenotypes.map((e) => e.ontology);
  } catch (error) {
    console.error('Error fetching gene ontology by Entrez ID:', error);
    throw new Error('Failed to fetch gene ontology by Entrez ID');
  }
};

/*
 * Find phenotype ontology terms by gene symbol
 */
const findByGeneSymbol = async ({ symbol }) => {
  try {
    const gene = await Genes.findOne({
      taxonId: 9606,
      symbol: symbol.toUpperCase()
    }, '-_id phenotypes').populate('phenotypes.ontology');
    return gene.phenotypes.map((e) => e.ontology);
  } catch (error) {
    console.error('Error fetching gene ontology by symbol:', error);
    throw new Error('Failed to fetch gene ontology by symbol');
  }
};

module.exports = {
  findByPoId,
  findByName,
  findByTaxonId,
  findByNamespace,
  findByCategory,
  findByEntrezId,
  findByGeneSymbol
};
