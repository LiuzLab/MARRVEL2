import { Gene } from './gene';
import { PDShape } from '../d3/interfaces/protein-domain-plot';

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
    AlphaMissense?: MethodScore;
    PrimateAI?: MethodScore;
    MCAP?: MethodScore;
    Polyphen2HDIV?: MethodScore;
    Polyphen2HVAR?: MethodScore;
    'GERP++RS'?: MethodScore;
    phyloP100wayVertebrate?: MethodScore;
    phyloP30wayMammalian?: MethodScore;
  };
}
const BPT_SCORES = {
  weight: {
    'B': 0,
    'P': 1,
    'D': 2,
  },
  value: {
    0: 'Benign',
    1: 'Possibly Damaging',
    2: 'Probably Damaging',
  }
};
const HMLN_SCORE = {
  weight: {
    'N': 0,
    'L': 1,
    'M': 2,
    'H': 3,
  },
  value: {
    0: 'Neutral (Non-Functional)',
    1: 'Low (Non-Functional)',
    2: 'Medium (Functional)',
    3: 'High (Functional)',
  }
};
const TD_SCORE = {
  weight: {
    'T': 0,
    'D': 1,
  },
  value: {
    0: 'Tolerated',
    1: 'Damaging',
  }
};
const BAP_SCORE = {
  weight: {
    'B': 0,
    'A': 1,
    'P': 2,
  },
  value: {
    0: 'Benign',
    1: 'Ambiguous',
    2: 'Likely Pathogenic',
  }
};
export const DBNSFP_METHOD_TO_INFO = {
  Polyphen2HDIV: BPT_SCORES,
  Polyphen2HVAR: BPT_SCORES,
  SIFT: BPT_SCORES,
  FATHMM: TD_SCORE,
  MCAP: TD_SCORE,
  MutationTaster: {
    weight: {
      'A': 3,
      'D': 2,
      'N': 1,
      'P': 0,
    },
    value: {
      3: 'Disease Causing Automatic',
      2: 'Disease Causing',
      1: 'Polymorphism',
      0: 'Polymorphism Automatic',
    }
  },
  MutationAssessor: HMLN_SCORE,
  AlphaMissense: BAP_SCORE,
  LRT: {
    weight: {
      'U': 0,
      'N': 1,
      'D': 2,
    },
    value: {
      0: 'Unknown',
      1: 'Neutral',
      2: 'Deleterious',
    }
  },
  PrimateAI: {
    weight: {
      'T': 0,
      'D': 1,
    },
    value: {
      0: 'Tolerated',
      1: 'Damaging',
    }
  }
};


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

export interface GnomADVariantData {
  chr: string;
  pos: number;
  ref: string;
  alt: string;
  exome?: {
    alleleCount?: number;
    alleleNum?: number;
    homCount?: number;
    alleleFreq?: number;
  };
  genome?: {
    alleleCount?: number;
    alleleNum?: number;
    homCount?: number;
    alleleFreq?: number;
  };
  total?: {
    alleleCount?: number;
    alleleNum?: number;
    homCount?: number;
    alleleFreq?: number;
  };
  transcripts?: [{
    geneSymbol: string;
    geneEnsemblId: string;
    ensemblId: string;
    proteinId?: string;
  }];
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

export interface ProteinDomain {
  type: string;
  name: string;
  start: number;
  end?: number;
  shape?: PDShape;
  phase?: number;
}

export interface SmartDomain extends ProteinDomain {
  entrezId: number;
  idx: number;
  type: 'SMART' | 'INTRINSIC' | 'INTRON';
  eValue: number;
  seq?: string;
}

export interface ModelMatcherData {
  modelOrganism: {
    id: number;
    scientificName: string;
    commonName: string;
  };
  tier: string;
  network: string;
  profileLink: string;
  matchingGeneName: string;
  matchingGeneId: number;
  matchingGeneSymbol: string;
  matchingGeneAliases: string;
  pi: string | null;
  lastName?: string;
  organization?: string;
}

