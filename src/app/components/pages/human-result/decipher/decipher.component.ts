import { Component, OnInit, Input } from '@angular/core';
import { take } from 'rxjs/operators';

import { ApiService } from '../../../../services/api.service';

import { HumanGene } from '../../../../interfaces/gene';
import { Variant } from '../../../../interfaces/variant';

@Component({
  selector: 'app-decipher',
  templateUrl: './decipher.component.html',
  styleUrls: ['./decipher.component.scss']
})
export class DECIPHERComponent implements OnInit {
  @Input() gene: HumanGene;
  @Input() variant: Variant;

  loading = false;
  data: DECIPHERData[] | null;

  constructor(
    private api: ApiService
  ) { }

  ngOnInit() {
    this.requestData();
  }

  requestData() {
    this.loading = true;
    const task = this.variant ?
      this.api.getDECIPHERByVariant(this.variant) :
      this.api.getDECIPHERByGenomLoc(this.gene.chr, this.gene.hg19Start, this.gene.hg19Stop);
    task
      .pipe(take(1))
      .subscribe((res: DECIPHERData[]) => {
        for (let i = 0; i < res.length; ++i) {
          res[i]['position'] = `${res[i].hg19Chr}:${res[i].hg19Start}`;
          if (res[i].hg19Start !== res[i].hg19Stop) {
            res[i]['position'] += `-${res[i].hg19Stop}`;
          }

          res[i]['size'] = res[i].hg19Stop - res[i].hg19Start + 1;
          res[i]['delObs'] = res[i].deletion ? (res[i].deletion.obs || 0) : 0;
          res[i]['dupObs'] = res[i].duplication ? (res[i].duplication.obs || 0) : 0;
        }
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
