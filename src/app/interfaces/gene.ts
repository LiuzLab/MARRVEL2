import { XRef } from './xref';

export interface Gene {
  taxonId: number;
  symbol: string;
  entrezId: number;
  xref?: XRef;
  name?: string;
  status?: string;
  alias?: string[];
  locusType?: string;
  chr?: string;
  location?: string;
  type?: string;
}

export interface HumanGene extends Gene {
  hgncId?: number;
}