import { Component, OnInit, OnChanges, Input } from '@angular/core';

@Component({
  selector: 'app-gnom-ad',
  templateUrl: './gnom-ad.component.html',
  styleUrls: ['./gnom-ad.component.scss']
})
export class GnomADComponent implements OnInit, OnChanges {
  @Input() data: GnomADVariantData;

  constructor() { }

  ngOnInit() {
  }
  ngOnChanges() {
    if (this.data) {
      console.log('gnomAD:', this.data);
      this.data.exome = this.data.exome || { alleleCount: 0, alleleNum: 0, homCount: 0 };
      this.data.genome = this.data.genome || { alleleCount: 0, alleleNum: 0, homCount: 0 };
    }
  }

}

interface GnomADVariantData {
  chr: string;
  pos: number;
  ref: string;
  alt: string;
  exome: {
    alleleCount?: number;
    alleleNum?: number;
    homCount?: number;
  };
  genome: {
    alleleCount?: number;
    alleleNum?: number;
    homCount?: number;
  };
  transcripts?: [{
    geneSymbol: string;
    geneEnsemblId: string;
    ensemblId: string;
    proteinId?: string;
  }];
}
