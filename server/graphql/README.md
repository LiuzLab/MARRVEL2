# GraphQL API Documentation

## Overview

This GraphQL API provides access to genomic data from various databases including Clinvar, genes, DIOPT, phenotype ontology, and other genomic resources.

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

### PhenotypeOntology Queries

#### 1. Get phenotype ontology term by PO ID

```graphql
query GetPhenotypeOntologyByPoId($poId: String!) {
  phenotypeOntologyByPoId(poId: $poId) {
    id
    name
    def
    namespace
    taxonId
    is_a
    categories {
      id
      name
    }
  }
}
```

**Variables:**
```json
{
  "poId": "PO:0000001"
}
```

#### 2. Search phenotype ontology terms by name

```graphql
query GetPhenotypeOntologyByName($name: String!, $limit: Int, $start: Int) {
  phenotypeOntologyByName(name: $name, limit: $limit, start: $start) {
    id
    name
    def
    namespace
    categories {
      id
      name
    }
  }
}
```

**Variables:**
```json
{
  "name": "leaf",
  "limit": 10,
  "start": 0
}
```

#### 3. Get phenotype ontology terms by taxon ID

```graphql
query GetPhenotypeOntologyByTaxonId($taxonId: Int!, $limit: Int, $start: Int) {
  phenotypeOntologyByTaxonId(taxonId: $taxonId, limit: $limit, start: $start) {
    id
    name
    namespace
    categories {
      id
      name
    }
  }
}
```

**Variables:**
```json
{
  "taxonId": 3702,
  "limit": 20,
  "start": 0
}
```

#### 4. Get phenotype ontology terms by namespace

```graphql
query GetPhenotypeOntologyByNamespace($namespace: String!, $limit: Int, $start: Int) {
  phenotypeOntologyByNamespace(namespace: $namespace, limit: $limit, start: $start) {
    id
    name
    def
    taxonId
  }
}
```

**Variables:**
```json
{
  "namespace": "plant_anatomy",
  "limit": 30,
  "start": 0
}
```

#### 5. Get phenotype ontology terms by category

```graphql
query GetPhenotypeOntologyByCategory($categoryId: Int!, $limit: Int, $start: Int) {
  phenotypeOntologyByCategory(categoryId: $categoryId, limit: $limit, start: $start) {
    id
    name
    def
    categories {
      id
      name
    }
  }
}
```

**Variables:**
```json
{
  "categoryId": 1,
  "limit": 25,
  "start": 0
}
```

### Pagination Example

For queries that support pagination, you can use the `start` and `limit` parameters to retrieve data in chunks:

```graphql
# Get first 20 results
query GetFirstPage {
  phenotypeOntologyByName(name: "leaf", limit: 20, start: 0) {
    id
    name
  }
}

# Get next 20 results (page 2)
query GetSecondPage {
  phenotypeOntologyByName(name: "leaf", limit: 20, start: 20) {
    id
    name
  }
}

# Get third page
query GetThirdPage {
  phenotypeOntologyByName(name: "leaf", limit: 20, start: 40) {
    id
    name
  }
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
  
  phenotypeOntologyByName(name: "leaf", limit: 5) {
    id
    name
    namespace
    categories {
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

### PhenotypeOntology
- `id`: String! - Phenotype ontology ID (PO ID)
- `name`: String - Term name
- `def`: String - Term definition
- `namespace`: String - Ontology namespace
- `taxonId`: Int - Organism taxonomy ID
- `is_a`: [String] - Parent term IDs
- `categories`: [PhenotypeOntologyCategory] - Associated categories

### PhenotypeOntologyCategory
- `id`: Int - Category identifier
- `name`: String - Category name

### PharosTarget
- `id`: Int! - Pharos target identifier
- `name`: String! - Target name
- `gene`: String - Associated gene symbol
- `accession`: String - Protein accession identifier
- `structureRefId`: String! - Structure reference ID
- `description`: String - Target description
- `idgFamily`: String - IDG family classification
- `idgTDL`: String - IDG target development level
- `idgDevLevel`: String - IDG development level
- `self`: String - Self reference URL
- `drugIds`: [Int!]! - Array of associated drug IDs
- `ligandIds`: [Int!]! - Array of associated ligand IDs
- `drugs`: [PharosDrug] - Associated drugs (populated from drugIds)
- `ligands`: [PharosLigand] - Associated ligands (populated from ligandIds)

### PharosDrug
- `id`: Int! - Drug identifier
- `name`: String! - Drug name
- `description`: String - Drug description
- `self`: String - Self reference URL
- `namespace`: String - Drug namespace
- `structureRefId`: String - Structure reference ID
- `idgDevLevel`: String - IDG development level

### PharosLigand
- `id`: Int! - Ligand identifier
- `name`: String! - Ligand name
- `description`: String - Ligand description
- `self`: String - Self reference URL
- `namespace`: String - Ligand namespace
- `structureRefId`: String - Structure reference ID
- `idgDevLevel`: String - IDG development level

## Pharos Queries

### Find Target by ID

Find a specific Pharos target by its ID.

**Query:**
```graphql
query($id: Int!) {
  pharosTargetById(id: $id) {
    id
    name
    gene
    accession
    description
    idgFamily
    idgTDL
    drugs {
      id
      name
      description
    }
    ligands {
      id
      name
      description
    }
  }
}
```

**Variables:**
```json
{
  "id": 1234
}
```

### Find Targets by IDs

Find multiple Pharos targets by their IDs with pagination support.

**Query:**
```graphql
query($ids: [Int!]!, $limit: Int, $start: Int) {
  pharosTargetsByIds(ids: $ids, limit: $limit, start: $start) {
    id
    name
    gene
    accession
    description
    idgTDL
    drugs {
      id
      name
    }
    ligands {
      id
      name
    }
  }
}
```

**Variables:**
```json
{
  "ids": [1234, 5678, 9012],
  "limit": 50,
  "start": 0
}
```

### Find Targets by Gene Entrez ID

Find Pharos targets associated with a specific gene via Entrez ID.

**Query:**
```graphql
query($entrezId: Int!, $limit: Int, $start: Int) {
  pharosTargetsByGeneEntrezId(entrezId: $entrezId, limit: $limit, start: $start) {
    id
    name
    gene
    accession
    description
    idgFamily
    idgTDL
    drugs {
      id
      name
      description
    }
    ligands {
      id
      name
      description
    }
  }
}
```

**Variables:**
```json
{
  "entrezId": 7157,
  "limit": 100,
  "start": 0
}
```

### Combining Gene and Pharos Data

To get both gene information and associated Pharos targets, use separate queries in a single GraphQL request:

**Query:**
```graphql
query($entrezId: Int!) {
  gene: geneByEntrezId(entrezId: $entrezId) {
    entrezId
    symbol
    name
    description
  }
  
  pharosTargets: pharosTargetsByGeneEntrezId(entrezId: $entrezId) {
    id
    name
    accession
    description
    idgFamily
    idgTDL
    drugs {
      id
      name
    }
    ligands {
      id
      name
    }
  }
}
```

**Variables:**
```json
{
  "entrezId": 7157
}
```

### StringInteraction
- `ensemblId1`: String! - First protein Ensembl ID (not gene ID)
- `ensemblId2`: String! - Second protein Ensembl ID (not gene ID)
- `experiments`: Int! - Experimental evidence score
- `database`: Int! - Database evidence score
- `combExpDb`: Int! - Combined experimental and database score

## String Queries

### Find Interactions by Ensembl Protein ID

Find STRING protein-protein interactions for a protein by its Ensembl protein ID.

**Query:**
```graphql
query($ensemblId: String!, $limit: Int, $start: Int) {
  stringInteractionsByEnsemblId(ensemblId: $ensemblId, limit: $limit, start: $start) {
    ensemblId1
    ensemblId2
    experiments
    database
    combExpDb
  }
}
```

**Variables:**
```json
{
  "ensemblId": "ENSP00000000233",
  "limit": 100,
  "start": 0
}
```

### Find Interaction Between Two Proteins

Find the specific STRING interaction between two proteins using their Ensembl protein IDs. This query searches bidirectionally.

**Query:**
```graphql
query($ensemblId1: String!, $ensemblId2: String!) {
  stringInteractionBetweenProteins(ensemblId1: $ensemblId1, ensemblId2: $ensemblId2) {
    ensemblId1
    ensemblId2
    experiments
    database
    combExpDb
  }
}
```

**Variables:**
```json
{
  "ensemblId1": "ENSP00000000233",
  "ensemblId2": "ENSP00000000412"
}
```

### DbNSFP
- `hg19Chr`: String! - Chromosome (hg19)
- `hg19Pos`: Int! - Position (hg19)
- `ref`: String! - Reference allele
- `alt`: String! - Alternative allele
- `scores`: DbNSFPScores! - All prediction scores
- `hg18Chr`: String - Chromosome (hg18)
- `hg18Pos`: Int - Position (hg18)
- `hg38Chr`: String - Chromosome (hg38)
- `hg38Pos`: Int - Position (hg38)
- `aaPos`: Int - Amino acid position
- `aaRef`: String - Reference amino acid
- `aaAlt`: String - Alternative amino acid
- `rsid`: String - dbSNP ID
- `ensemblId`: String - Ensembl gene ID
- `transcriptEnsemblId`: String - Ensembl transcript ID
- `proteinEnsemblId`: String - Ensembl protein ID
- `symbol`: String - Gene symbol

### DbNSFPScores
- `SIFT`: PredictionScore - SIFT predictions
- `SIFT4G`: PredictionScore - SIFT4G predictions
- `Polyphen2HDIV`: PredictionScore - PolyPhen-2 HumDiv predictions
- `Polyphen2HVAR`: PredictionScore - PolyPhen-2 HumVar predictions
- `MutationTaster`: PredictionScore - MutationTaster predictions
- `MutationAssessor`: PredictionScore - MutationAssessor predictions
- `CADD`: CADDScore - CADD scores
- `REVEL`: REVELScore - REVEL scores
- `AlphaMissense`: PredictionScore - AlphaMissense predictions
- `PrimateAI`: SinglePredictionScore - PrimateAI predictions
- `MCAP`: SinglePredictionScore - M-CAP predictions
- `GERPppRS`: ConservationScore - GERP++ RS conservation scores
- `phyloP100way_vertebrate`: ConservationScore - phyloP 100-way vertebrate conservation
- `phyloP470way_mammalian`: ConservationScore - phyloP 470-way mammalian conservation

### PredictionScore
- `scores`: [Float] - Prediction scores (multiple transcripts)
- `predictions`: [String] - Prediction categories (multiple transcripts)
- `rankscore`: Float - Rank score

### SinglePredictionScore
- `score`: Float - Single prediction score
- `prediction`: String - Single prediction category
- `rankscore`: Float - Rank score

### CADDScore
- `rawScore`: Float - CADD raw score
- `phred`: Float - CADD Phred score
- `rankscore`: Float - CADD rank score

### REVELScore
- `scores`: [Float] - REVEL scores (multiple transcripts)
- `rankscore`: Float - REVEL rank score

### ConservationScore
- `score`: Float - Conservation score
- `rankscore`: Float - Conservation rank score

## dbNSFP Queries

### Find Variant Annotations by Variant

Find dbNSFP annotations for a specific variant by chromosome, position, reference, and alternative alleles.

**Query:**
```graphql
query($chr: String!, $pos: Int!, $ref: String!, $alt: String!, $build: String) {
  dbnsfpByVariant(chr: $chr, pos: $pos, ref: $ref, alt: $alt, build: $build) {
    hg19Chr
    hg19Pos
    hg38Chr
    hg38Pos
    ref
    alt
    symbol
    rsid
    scores {
      SIFT {
        scores
        predictions
        rankscore
      }
      CADD {
        rawScore
        phred
        rankscore
      }
      REVEL {
        scores
        rankscore
      }
      AlphaMissense {
        scores
        predictions
        rankscore
      }
    }
  }
}
```

**Variables:**
```json
{
  "chr": "17",
  "pos": 43094454,
  "ref": "A",
  "alt": "T",
  "build": "hg19"
}
```

### Find Variants by Position

Find all dbNSFP variants at a specific genomic position.

**Query:**
```graphql
query($chr: String!, $pos: Int!, $build: String, $limit: Int, $start: Int) {
  dbnsfpByPosition(chr: $chr, pos: $pos, build: $build, limit: $limit, start: $start) {
    ref
    alt
    symbol
    scores {
      CADD {
        phred
      }
      REVEL {
        rankscore
      }
    }
  }
}
```

**Variables:**
```json
{
  "chr": "17",
  "pos": 43094454,
  "build": "hg19",
  "limit": 50,
  "start": 0
}
```

### Find Variants by Gene Symbol

Find dbNSFP annotations for all variants in a specific gene.

**Query:**
```graphql
query($symbol: String!, $limit: Int, $start: Int) {
  dbnsfpByGeneSymbol(symbol: $symbol, limit: $limit, start: $start) {
    hg19Chr
    hg19Pos
    ref
    alt
    rsid
    scores {
      SIFT {
        rankscore
      }
      Polyphen2HDIV {
        rankscore
      }
      CADD {
        phred
      }
    }
  }
}
```

**Variables:**
```json
{
  "symbol": "TP53",
  "limit": 100,
  "start": 0
}
```

### Find Variant by dbSNP ID

Find dbNSFP annotations for a variant by its dbSNP ID.

**Query:**
```graphql
query($rsid: String!) {
  dbnsfpByRsid(rsid: $rsid) {
    hg19Chr
    hg19Pos
    ref
    alt
    symbol
    scores {
      CADD {
        phred
      }
      REVEL {
        scores
        rankscore
      }
      AlphaMissense {
        scores
        predictions
        rankscore
      }
    }
  }
}
```

**Variables:**
```json
{
  "rsid": "rs28934578"
}
```