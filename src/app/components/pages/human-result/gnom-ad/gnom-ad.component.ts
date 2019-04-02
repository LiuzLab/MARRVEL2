import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-gnom-ad',
  templateUrl: './gnom-ad.component.html',
  styleUrls: ['./gnom-ad.component.scss']
})
export class GnomADComponent implements OnInit {
  @Input() data: GnomADVariantData;

  constructor() { }

  ngOnInit() {
  }

}

interface GnomADVariantData {
  chr: string;
  pos: number;
  ref: string;
  alt: string;
  exome: {
    alleleCount: number;
    alleleNum: number;
    homCount: number;
  };
  genome: {
    alleleCount: number;
    alleleNum: number;
    homCount: number;
  };
  transcripts?: [{
    geneSymbol: string;
    geneEnsemblId: string;
    ensemblId: string;
    proteinId?: string;
  }];
}
