import { Component, OnChanges, Input, SimpleChanges } from '@angular/core';

import { ApiService } from '../../../../services/api.service';

import { HumanGene } from '../../../../interfaces/gene';
import { Variant } from '../../../../interfaces/variant';
import { request } from 'https';

@Component({
  selector: 'app-geno2mp',
  templateUrl: './geno2mp.component.html',
  styleUrls: ['./geno2mp.component.scss']
})
export class Geno2mpComponent implements OnChanges {
  @Input() variant: Variant | null;
  @Input() gene: HumanGene | null;

  loading = false;
  data: Geno2MPResult;

  constructor(
    private api: ApiService
  ) { }

  ngOnChanges(change: SimpleChanges) {
    if (change.variant && change.variant.currentValue.chr) {
      this.loading = true;
      this.api.getGeno2MPByVariant(this.variant)
        .subscribe((res: Geno2MPResult) => {
          for (let i=0; i<res.hpoProfiles.length; ++i) {
            res.hpoProfiles[i]['broadTerm'] = res.hpoProfiles[i].broad.hpoTerm || '';
            res.hpoProfiles[i]['mediumTerm'] = res.hpoProfiles[i].medium.hpoTerm || '';
            res.hpoProfiles[i]['narrowTerm'] = res.hpoProfiles[i].narrow.hpoTerm || '';
          }
          console.log(res);
          this.data = res;
          this.loading = false;
        });
    }
  }

}

interface Geno2MPResult {
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
      hpoId: string;
      hpoTerm: string;
    },
    medium: {
      hpoId: string;
      hpoTerm: string;
    },
    broad: {
      hpoId: string;
      hpoTerm: string;
    },
    affectedStatus: string;
  }];
  funcAnno: string;
}
