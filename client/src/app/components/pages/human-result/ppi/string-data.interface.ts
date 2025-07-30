export interface StringData {
  source: {
    proteinId: string;
    entrezId?: number;
    symbol?: string;
  };
  interactor: {
    proteinId: string;
    entrezId?: number;
    symbol?: string;
    ppis?: [{
      proteinId1: string;
      proteinId2: string;
      experiments: number;
      database: string;
    }]
  }
  experiments: number;
  database: number;
}
