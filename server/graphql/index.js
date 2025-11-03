/**
 * GraphQL API module for MARRVEL
 *
 * This module provides GraphQL API endpoints for various data sources
 * including Clinvar, genes, DIOPT, and other genomic databases.
 *
 * Usage:
 * - Access GraphQL playground at /graphql (in development)
 * - Send GraphQL queries to /graphql endpoint
 *
 * Available queries:
 * - Clinvar: findByGeneSymbol, findByGeneEntrezId, findByVariant, getCountsByEntrezId
 */

module.exports = {
  handler: require('./graphqlHandler'),
};
