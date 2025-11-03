# GraphQL API Documentation

## Overview

This GraphQL API provides access to genomic data from various databases including Clinvar, genes, and other genomic resources.

## Endpoint

- **GraphQL Endpoint**: `/graphql`
- **GraphiQL Interface**: `/graphiql` (development only)
- **Method**: POST
- **Content-Type**: `application/json`

## Development

In development mode, GraphiQL playground is available at `/graphiql` for interactive query testing. You can also access the GraphQL endpoint directly at `/graphql`.

## Available Queries

### Clinvar Queries

#### 1. Get Clinvar variants by gene symbol

```graphql
query GetClinvarByGeneSymbol($symbol: String!) {
  clinvarByGeneSymbol(symbol: $symbol) {
    chr
    start
    stop
    ref
    alt
    uid
    condition
    title
    significance {
      description
      lastEvaluated
      reviewStatus
    }
    band
  }
}
```

**Variables:**
```json
{
  "symbol": "BRCA1"
}
```

#### 2. Get Clinvar variants by gene Entrez ID

```graphql
query GetClinvarByGeneEntrezId($entrezId: Int!) {
  clinvarByGeneEntrezId(entrezId: $entrezId) {
    chr
    start
    stop
    condition
    title
    significance {
      description
    }
  }
}
```

**Variables:**
```json
{
  "entrezId": 672
}
```

#### 3. Get Clinvar variant by specific variant

```graphql
query GetClinvarByVariant($variant: String!, $build: String) {
  clinvarByVariant(variant: $variant, build: $build) {
    chr
    start
    stop
    ref
    alt
    condition
    title
    significance {
      description
      reviewStatus
    }
  }
}
```

**Variables:**
```json
{
  "variant": "17-43094454-A-T",
  "build": "hg19"
}
```

#### 4. Get Clinvar variant counts by gene Entrez ID

```graphql
query GetClinvarCounts($entrezId: Int!) {
  clinvarCountsByEntrezId(entrezId: $entrezId) {
    pathogenic
    likelyPathogenic
    likelyBenign
    benign
  }
}
```

**Variables:**
```json
{
  "entrezId": 672
}
```

### Gene Queries

#### 1. Get gene by symbol and taxon ID

```graphql
query GetGeneBySymbol($symbol: String!, $taxonId: Int!) {
  geneBySymbol(symbol: $symbol, taxonId: $taxonId) {
    entrezId
    symbol
    name
    alias
    taxonId
    locusType
    status
    chr
    hg19Start
    hg19Stop
    xref {
      ensemblId
      omimId
      hgncId
    }
  }
}
```

**Variables:**
```json
{
  "symbol": "BRCA1",
  "taxonId": 9606
}
```

#### 2. Get gene by Entrez ID

```graphql
query GetGeneByEntrezId($entrezId: Int!) {
  geneByEntrezId(entrezId: $entrezId) {
    entrezId
    symbol
    name
    alias
    taxonId
    xref {
      ensemblId
      omimId
    }
  }
}
```

**Variables:**
```json
{
  "entrezId": 672
}
```

#### 3. Get gene by HGNC ID

```graphql
query GetGeneByHgncId($hgncId: Int!) {
  geneByHgncId(hgncId: $hgncId) {
    entrezId
    symbol
    name
    hgncId
  }
}
```

**Variables:**
```json
{
  "hgncId": 1100
}
```

#### 4. Get gene by Ensembl ID

```graphql
query GetGeneByEnsemblId($ensemblId: String!) {
  geneByEnsemblId(ensemblId: $ensemblId) {
    entrezId
    symbol
    name
    xref {
      ensemblId
      omimId
    }
  }
}
```

**Variables:**
```json
{
  "ensemblId": "ENSG00000012048"
}
```

#### 5. Search genes by prefix

```graphql
query GetGenesByPrefix($prefix: String!, $taxonId: Int!, $limit: Int) {
  genesByPrefix(prefix: $prefix, taxonId: $taxonId, limit: $limit) {
    entrezId
    symbol
    name
    alias
  }
}
```

**Variables:**
```json
{
  "prefix": "BRCA",
  "taxonId": 9606,
  "limit": 10
}
```

#### 6. Get genes by genomic location

```graphql
query GetGenesByGenomicLocation($chr: String!, $posStart: Int!, $posStop: Int!, $build: String) {
  genesByGenomicLocation(chr: $chr, posStart: $posStart, posStop: $posStop, build: $build) {
    entrezId
    symbol
    name
    chr
    hg19Start
    hg19Stop
  }
}
```

**Variables:**
```json
{
  "chr": "17",
  "posStart": 43000000,
  "posStop": 44000000,
  "build": "hg19"
}
```

### DIOPT Queries

#### 1. Get DIOPT alignments by Entrez ID

```graphql
query GetDioptAlignmentByEntrezId($entrezId: Int!) {
  dioptAlignmentByEntrezId(entrezId: $entrezId) {
    entrezId
    data {
      sequence
      style
      position
    }
  }
}
```

**Variables:**
```json
{
  "entrezId": 672
}
```

#### 2. Get DIOPT domains by Entrez ID

```graphql
query GetDioptDomainsByEntrezId($entrezId: Int!) {
  dioptDomainsByEntrezId(entrezId: $entrezId) {
    entrezId
    domains {
      name
      start
      end
      proteinId
      externalId
    }
  }
}
```

**Variables:**
```json
{
  "entrezId": 672
}
```

#### 3. Get DIOPT orthologs by Entrez ID

```graphql
query GetDioptOrthologsByEntrezId($entrezId: Int!) {
  dioptOrthologsByEntrezId(entrezId: $entrezId) {
    taxonId1
    entrezId1
    taxonId2
    entrezId2
    score
    bestScore
    confidence
    gene1 {
      symbol
    }
    gene2 {
      symbol
      entrezId
      name
    }
  }
}
```

**Variables:**
```json
{
  "entrezId": 672
}
```

#### 4. Get DIOPT orthologs by taxon IDs

```graphql
query GetDioptOrthologsByTaxonId($taxonId1: Int!, $taxonId2: Int!, $limit: Int) {
  dioptOrthologsByTaxonId(taxonId1: $taxonId1, taxonId2: $taxonId2, limit: $limit) {
    entrezId1
    entrezId2
    score
    confidence
    gene1 {
      symbol
      entrezId
    }
    gene2 {
      symbol
      entrezId
    }
  }
}
```

**Variables:**
```json
{
  "taxonId1": 9606,
  "taxonId2": 7227,
  "limit": 50
}
```

## Example Usage with curl

```bash
curl -X POST \
  http://localhost:3000/graphql \
  -H 'Content-Type: application/json' \
  -d '{
    "query": "query GetClinvarByGeneSymbol($symbol: String!) { clinvarByGeneSymbol(symbol: $symbol) { chr start stop condition title significance { description } } }",
    "variables": {
      "symbol": "BRCA1"
    }
  }'
```

## Interactive Development

For easier development and testing, you can use the GraphiQL interface:

1. **Start the server** in development mode
2. **Open your browser** to `http://localhost:3000/graphiql`
3. **Use the interactive interface** to:
   - Browse the schema documentation
   - Write and test queries with autocomplete
   - View query results in real-time
   - Explore available types and fields

### Example GraphiQL Query

You can copy and paste this into the GraphiQL interface:

```graphql
{
  geneBySymbol(symbol: "BRCA1", taxonId: 9606) {
    entrezId
    symbol
    name
    chr
    hg19Start
    hg19Stop
  }
  
  clinvarByGeneSymbol(symbol: "BRCA1") {
    chr
    start
    condition
    significance {
      description
    }
  }
  
  dioptOrthologsByEntrezId(entrezId: 672) {
    taxonId2
    entrezId2
    score
    confidence
    gene2 {
      symbol
      name
    }
  }
}
```

## Error Handling

All GraphQL queries return structured error messages in case of failures. Common error scenarios:

- Invalid variant format
- Gene symbol not found
- Database connection issues
- Invalid parameters

## Schema Types

### Clinvar
- `chr`: String! - Chromosome
- `start`: Int! - Start position
- `stop`: Int! - Stop position
- `ref`: String - Reference allele
- `alt`: String - Alternative allele
- `uid`: Int - Clinvar UID
- `condition`: String - Associated condition
- `title`: String - Variant title
- `significance`: ClinvarSignificance - Clinical significance
- `band`: String - Chromosomal band

### ClinvarSignificance
- `description`: String - Significance description
- `lastEvaluated`: String - Last evaluation date
- `reviewStatus`: String - Review status

### ClinvarCounts
- `pathogenic`: Int! - Number of pathogenic variants
- `likelyPathogenic`: Int! - Number of likely pathogenic variants
- `likelyBenign`: Int! - Number of likely benign variants
- `benign`: Int! - Number of benign variants

### Gene
- `taxonId`: Int! - NCBI Taxonomy ID
- `entrezId`: Int! - Entrez Gene ID
- `symbol`: String! - Gene symbol
- `hgncId`: Int - HGNC ID
- `alias`: [String] - Gene aliases
- `name`: String - Gene name
- `locusType`: String - Locus type
- `status`: String - Gene status
- `xref`: GeneXref - Cross-references
- `chr`: String - Chromosome
- `hg19Start`: Int - Start position (hg19)
- `hg19Stop`: Int - Stop position (hg19)
- `hg38Start`: Int - Start position (hg38)
- `hg38Stop`: Int - Stop position (hg38)
- `uniprotKBId`: String - UniProt KB ID

### GeneXref
- `ensemblId`: String - Ensembl ID
- `omimId`: String - OMIM ID
- `mgiId`: String - MGI ID
- `hgncId`: String - HGNC ID
- `pomBaseId`: String - PomBase ID

### DioptAlignment
- `entrezId`: Int! - Entrez Gene ID
- `data`: [DioptAlignmentData] - Alignment data entries

### DioptAlignmentData
- `sequence`: String - Aligned sequence
- `style`: [String] - Styling information for alignment visualization
- `position`: Int - Position in alignment

### DioptDomain
- `name`: String! - Domain name
- `start`: String! - Domain start position
- `end`: String! - Domain end position
- `proteinId`: String - Protein identifier
- `externalId`: String - External database identifier

### DioptDomainSet
- `entrezId`: Int! - Entrez Gene ID
- `domains`: [DioptDomain!]! - List of domains

### DioptOrtholog
- `taxonId1`: Int! - Source organism taxonomy ID
- `entrezId1`: Int! - Source gene Entrez ID
- `taxonId2`: Int! - Target organism taxonomy ID
- `entrezId2`: Int! - Target gene Entrez ID
- `score`: Int! - Orthology confidence score
- `bestScore`: Boolean! - Whether this is the best score
- `bestScoreRev`: Boolean - Whether this is the best reverse score
- `confidence`: String! - Confidence level (High/Moderate/Low)
- `gene1`: Gene - Source gene information
- `gene2`: Gene - Target gene information