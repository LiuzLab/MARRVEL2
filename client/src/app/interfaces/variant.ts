export interface Variant {
  chr: string;
  pos: number;
  ref: string;
  alt: string;
  build?: 'hg19' | 'hg38';
}
