import { Gene } from './gene';

export interface Geno2MPResult {
  hg19Chr: string;
  hg19Pos: number;
  ref: string;
  alt: string;
  genes: [{
    entrezId: number;
    symbol: string;
  }];
  homCount: number;
  hetCount: number;
  hpoCount: number;
  hpoProfiles: [{
    narrow: {
      hpoIds: string[];
      hpoId: string;
      hpoTerm: string;
    },
    medium: {
      hpoIds: string[];
      hpoId: string;
      hpoTerm: string;
    },
    broad: {
      hpoIds: string[];
      hpoId: string;
      hpoTerm: string;
    },
    affectedStatus: string;
  }];
  funcAnno: string;
}

export interface MethodScore {
  rawScore?: number;
  score?: number;
  phred?: number;
  prediction?: string;
  rankscore?: number;
  convertedRankscore?: number;
}
export interface DbNSFPData {
  hg19Chr: string;
  hg19Pos: number;
  ref: string;
  alt: string;
  scores: {
    CADD?: MethodScore;
    REVEL?: MethodScore;
    MCAP?: MethodScore;
    Polyphen2HDIV?: MethodScore;
    Polyphen2HVAR?: MethodScore;
    'GERP++RS'?: MethodScore;
    phyloP100wayVertebrate?: MethodScore;
    phyloP30wayMammalian?: MethodScore;
  };
}

export interface PhenotypePopulated {
  id: string;
  ontology: {
    id: string;
    name: string;
    categories: [{
      id: number,
      name: string
    }];
  };
}

export interface DIOPTOrtholog {
  bestScore: boolean;
  bestScoreRev: boolean;
  confidence: 'high' | 'moderate' | 'low';
  entrezId1: number;
  entrezId2: number;
  gene1: Gene;
  gene2: Gene;
  score: number;
  taxonId1: number;
  taxonId2: number;
}

export interface ClinVarVarinat {
  uid: number;
  title: string;
  start?: number;
  stop?: number;
  significance?: {
    reviewStatus?: string;
    description?: string;
    lastEvaluated?: string;
  };
  condition?: string;
}

export interface PrimateData {
  chr: string;
  pos: number;
  ref: string;
  alt: string;
  alleleCount?: number;
  alleleNum?: number;
  alleleFreq?: number;
  abHet?: number;
  abHom?: number;
  filter?: string;
  baseQRankSum?: number;
  excessHet?: number;
  phredP?: number;
  mleAC?: number;
  mleAF?: number;
}
