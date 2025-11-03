const { createHandler } = require('graphql-http/lib/use/express');
const { buildSchema } = require('graphql');
const { readFileSync } = require('fs');
const path = require('path');

// Import resolvers
const clinvarResolvers = require('./resolvers/clinvar.resolvers');

// Read schema files
const clinvarTypeDefs = readFileSync(path.join(__dirname, 'schemas/clinvar.schema.graphql'), 'utf8');

// Combine all schemas
const typeDefs = `
  ${clinvarTypeDefs}

  type Query {
    clinvarByGeneSymbol(symbol: String!): [Clinvar!]!
    clinvarByGeneEntrezId(entrezId: Int!): [Clinvar!]!
    clinvarByVariant(variant: String!, build: String = "hg19"): Clinvar
    clinvarCountsByEntrezId(entrezId: Int!): ClinvarCounts!
  }
`;

// Build the schema
const schema = buildSchema(typeDefs);

// Create root resolver
const rootValue = {
  clinvarByGeneSymbol: clinvarResolvers.findByGeneSymbol,
  clinvarByGeneEntrezId: clinvarResolvers.findByGeneEntrezId,
  clinvarByVariant: clinvarResolvers.findByVariant,
  clinvarCountsByEntrezId: clinvarResolvers.getCountsByEntrezId,
};

// Create and export the GraphQL handler
module.exports = createHandler({
  schema,
  rootValue,
  graphiql: process.env.NODE_ENV !== 'production', // Enable GraphiQL in development
});
