import { Component, OnInit, OnChanges, Input, SimpleChanges } from '@angular/core';

import { ApiService } from '../../../../services/api.service';
import { Variant } from '../../../../interfaces/variant';

@Component({
  selector: 'app-gnom-ad',
  templateUrl: './gnom-ad.component.html',
  styleUrls: ['./gnom-ad.component.scss']
})
export class GnomADComponent implements OnChanges {
  @Input() variant: Variant;

  loading = false;
  data: GnomADVariantData;

  constructor(
    private api: ApiService
  ) { }

  ngOnChanges(change: SimpleChanges) {
    if (change.variant && change.variant.currentValue) {
      this.loading = true;
      this.api.getGnomADVaraint(this.variant)
        .subscribe((res) => {
          res.exome = res.exome || { alleleCount: 0, alleleNum: 0, homCount: 0 };
          res.genome = res.genome || { alleleCount: 0, alleleNum: 0, homCount: 0 };

          this.data = res;
          this.loading = false;
        });
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
