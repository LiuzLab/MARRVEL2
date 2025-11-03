/**
 * GraphQL API module for MARRVEL
 *
 * This module provides GraphQL API endpoints for various data sources
 * including Clinvar, genes, DIOPT, phenotype ontology, and other genomic databases.
 *
 * Usage:
 * - Access GraphQL playground at /graphql (in development)
 * - Send GraphQL queries to /graphql endpoint
 *
 * Available queries:
 * - Clinvar: findByGeneSymbol, findByGeneEntrezId, findByVariant, getCountsByEntrezId
 * - Gene: findByGeneSymbol, findByEntrezId, findByHgncId, findByEnsemblId,
 *         findByPrefix, findByGenomicLocation
 * - Diopt: findAlignmentsByEntrezId, findDomainsByEntrezId, findOrthologsByEntrezId,
 *          findOrthologsByTaxonIds
 * - PhenotypeOntology: findByPoId, findByName, findByTaxonId, findByNamespace,
 *                      findByCategory
 */

module.exports = {
  handler: require('./graphqlHandler'),
};
