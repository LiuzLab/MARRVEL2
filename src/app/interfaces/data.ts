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
    category: {
      id: number,
      name: string
    };
  };
}

