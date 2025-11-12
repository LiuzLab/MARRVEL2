const { createHandler } = require('graphql-http/lib/use/express');
const { buildSchema } = require('graphql');
const { readFileSync } = require('fs');
const path = require('path');

// Import resolvers
const clinvarResolvers = require('./resolvers/clinvar.resolvers');
const geneResolvers = require('./resolvers/gene.resolvers');
const dioptResolvers = require('./resolvers/diopt.resolvers');
const phenotypeOntologyResolvers = require('./resolvers/phenotype-ontology.resolvers');
const pharosResolvers = require('./resolvers/pharos.resolver');
const stringResolvers = require('./resolvers/string.resolvers');
const dbnsfpResolvers = require('./resolvers/dbnsfp.resolvers');

// Read schema files
const clinvarTypeDefs = readFileSync(path.join(__dirname, 'schemas/clinvar.schema.graphql'), 'utf8');
const geneTypeDefs = readFileSync(path.join(__dirname, 'schemas/gene.schema.graphql'), 'utf8');
const dioptTypeDefs = readFileSync(path.join(__dirname, 'schemas/diopt.schema.graphql'), 'utf8');
const phenotypeOntologyTypeDefs = readFileSync(path.join(__dirname, 'schemas/phenotype-ontology.schema.graphql'), 'utf8');
const pharosTypeDefs = readFileSync(path.join(__dirname, 'schemas/pharos.schema.graphql'), 'utf8');
const stringTypeDefs = readFileSync(path.join(__dirname, 'schemas/string.schema.graphql'), 'utf8');
const dbnsfpTypeDefs = readFileSync(path.join(__dirname, 'schemas/dbnsfp.schema.graphql'), 'utf8');

// Combine all schemas
const typeDefs = `
  ${clinvarTypeDefs}
  ${geneTypeDefs}
  ${dioptTypeDefs}
  ${phenotypeOntologyTypeDefs}
  ${pharosTypeDefs}
  ${stringTypeDefs}
  ${dbnsfpTypeDefs}

  type Query {
    clinvarByGeneSymbol(symbol: String!): [Clinvar!]!
    clinvarByGeneEntrezId(entrezId: Int!): [Clinvar!]!
    clinvarByVariant(variant: String!, build: String = "hg19"): Clinvar
    clinvarCountsByEntrezId(entrezId: Int!): ClinvarCounts!

    geneBySymbol(symbol: String!, taxonId: Int!): Gene
    geneByEntrezId(entrezId: Int!): Gene
    geneByHgncId(hgncId: Int!): Gene
    geneByEnsemblId(ensemblId: String!): Gene
    genesByPrefix(prefix: String!, taxonId: Int!, limit: Int = 30): [Gene!]!
    genesByGenomicLocation(chr: String!, posStart: Int!, posStop: Int!, build: String = "hg19"): [Gene!]!

    dioptAlignmentByEntrezId(entrezId: Int!): DioptAlignment
    dioptDomainsByEntrezId(entrezId: Int!): DioptDomainSet!
    dioptOrthologsByEntrezId(entrezId: Int!): [DioptOrtholog!]!
    dioptOrthologsByTaxonId(taxonId1: Int!, taxonId2: Int!, limit: Int = 100): [DioptOrtholog!]!
    
    phenotypeOntologyByPoId(poId: String!): PhenotypeOntology
    phenotypeOntologyByName(name: String!, limit: Int = 50, start: Int = 0): [PhenotypeOntology!]!
    phenotypeOntologyByTaxonId(taxonId: Int!, limit: Int = 100, start: Int = 0): [PhenotypeOntology!]!
    phenotypeOntologyByNamespace(namespace: String!, limit: Int = 100, start: Int = 0): [PhenotypeOntology!]!
    phenotypeOntologyByCategory(categoryId: Int!, limit: Int = 100, start: Int = 0): [PhenotypeOntology!]!
    phenotypeOntologyByEntrezId(entrezId: Int!): [PhenotypeOntology!]!
    phenotypeOntologyByGeneSymbol(symbol: String!): [PhenotypeOntology!]!
    
    pharosTargetById(id: Int!): PharosTarget
    pharosTargetsByIds(ids: [Int!]!, limit: Int = 100, start: Int = 0): [PharosTarget!]!
    pharosTargetsByGeneEntrezId(entrezId: Int!, limit: Int = 100, start: Int = 0): [PharosTarget!]!
    
    stringInteractionsByEntrezId(entrezId: Int!, limit: Int = 100, start: Int = 0): [StringInteraction!]!

    dbnsfpByVariant(chr: String!, pos: Int!, ref: String!, alt: String!, build: String!): DbNSFP
    dbnsfpByPosition(chr: String!, pos: Int!, build: String!, limit: Int = 100, start: Int = 0): [DbNSFP!]!
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

  geneBySymbol: geneResolvers.findByGeneSymbol,
  geneByEntrezId: geneResolvers.findByEntrezId,
  geneByHgncId: geneResolvers.findByHgncId,
  geneByEnsemblId: geneResolvers.findByEnsemblId,
  genesByPrefix: geneResolvers.findByPrefix,
  genesByGenomicLocation: geneResolvers.findByGenomicLocation,

  dioptAlignmentByEntrezId: dioptResolvers.findAlignmentsByEntrezId,
  dioptDomainsByEntrezId: dioptResolvers.findDomainsByEntrezId,
  dioptOrthologsByEntrezId: dioptResolvers.findOrthologsByEntrezId,

  phenotypeOntologyByPoId: phenotypeOntologyResolvers.findByPoId,
  phenotypeOntologyByName: phenotypeOntologyResolvers.findByName,
  phenotypeOntologyByTaxonId: phenotypeOntologyResolvers.findByTaxonId,
  phenotypeOntologyByNamespace: phenotypeOntologyResolvers.findByNamespace,
  phenotypeOntologyByCategory: phenotypeOntologyResolvers.findByCategory,
  phenotypeOntologyByEntrezId: phenotypeOntologyResolvers.findByEntrezId,
  phenotypeOntologyByGeneSymbol: phenotypeOntologyResolvers.findByGeneSymbol,

  pharosTargetById: pharosResolvers.pharosTargetById,
  pharosTargetsByIds: pharosResolvers.pharosTargetsByIds,
  pharosTargetsByGeneEntrezId: pharosResolvers.pharosTargetsByGeneEntrezId,

  stringInteractionsByEntrezId: stringResolvers.stringInteractionsByEntrezId,

  dbnsfpByVariant: dbnsfpResolvers.dbnsfpByVariant,
  dbnsfpByPosition: dbnsfpResolvers.dbnsfpByPosition,

  // Type resolvers
  PharosTarget: pharosResolvers.PharosTarget,
};

// Create and export the GraphQL handler
module.exports = createHandler({
  schema,
  rootValue,
  graphiql: process.env.NODE_ENV !== 'production', // Enable GraphiQL in development
});
