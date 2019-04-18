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
