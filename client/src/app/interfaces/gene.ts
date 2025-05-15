import { XRef } from './xref';

export interface Gene {
  taxonId: number;
  symbol: string;
  entrezId: number;
  xref?: XRef;
  name?: string;
  status?: string;
  alias?: string[];
  prevSymbols?: string[];
  locusType?: string;
  chr?: string;
  location?: string;
  type?: string;
}

export interface HumanGene extends Gene {
  hgncId?: number;
  entrezSummary?: string;
  chr?: string;
  hg19Start?: number;
  hg19Stop?: number;
  phenotypes?: [{
    id: string;
    name: string;
    ontology: {
      categories: [{
        id: number;
        name: string;
      }],
      name?: string;
      id?: string;
      def?: string;
      is_a?: string[];
      synonym?: string[];
    };
  }];
  gos?: [{
    goId: string;
    ontology: {
      id: string;
      name: string;
      namespace: string;
      agrSlimGoId?: string;
    };
    assignedBy?: string;
    date?: string;
    eviCode?: string;
    references?: string[];
  }];
  uniprotKBId?: string;
}
