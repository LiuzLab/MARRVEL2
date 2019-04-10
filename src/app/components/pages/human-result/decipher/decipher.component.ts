import { Component, OnChanges, Input, SimpleChanges } from '@angular/core';

import { ApiService } from '../../../../services/api.service';

import { Gene } from '../../../../interfaces/gene';
import { Variant } from '../../../../interfaces/variant';

@Component({
  selector: 'app-decipher',
  templateUrl: './decipher.component.html',
  styleUrls: ['./decipher.component.scss']
})
export class DECIPHERComponent implements OnChanges {
  @Input() variant: Variant;
  @Input() gene: Gene;

  loading = false;
  data: DECIPHERData[] | null;

  constructor(
    private api: ApiService
  ) { }

  ngOnChanges(change: SimpleChanges) {
    console.log(change);
    if (change.variant && change.variant.currentValue.chr) {
      this.requestData();
    }
  }

  requestData() {
    this.loading = true;
    this.api.getDECIPHERByVariant(this.variant)
      .subscribe((res: DECIPHERData[]) => {
        for (let i = 0; i < res.length; ++i) {
          res[i]['position'] = `${res[i].hg19Chr}:${res[i].hg19Start}`;
          if (res[i].hg19Start !== res[i].hg19Stop) {
            res[i]['position'] += `-${res[i].hg19Stop}`;
          }

          res[i]['size'] = res[i].hg19Stop - res[i].hg19Start + 1;
          res[i]['delObs'] = res[i].deletion.obs || 0;
          res[i]['dupObs'] = res[i].duplication.obs || 0;
        }
        console.log(res);
        this.data = res;
        this.loading = false;
      });
  }

}

interface DECIPHERData {
  hg19Chr: string;
  hg19Start: number;
  hg19Stop: number;
  sampleSize: number;
  study: string;
  freq: number;
  std: number;
  obs: number;
  cnvType: number;
  duplication: {
    std: number;
    obs: number;
    freq: number;
  };
  deletion: {
    std: number;
    obs: number;
    freq: number;
  };
}
