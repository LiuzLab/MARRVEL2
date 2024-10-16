import { Component, OnInit, Input } from '@angular/core';
import { take } from 'rxjs/operators';

import { Variant } from './../../../../interfaces/variant';
import { ApiService } from '../../../../services/api.service';
import { DbNSFPData, DBNSFP_METHOD_TO_INFO as METHOD_TO_INFO } from 'src/app/interfaces/data';
import { Animations } from 'src/app/animations';

@Component({
  selector: 'app-dbnsfp',
  templateUrl: './dbnsfp.component.html',
  styleUrls: ['./dbnsfp.component.scss'],
  animations: [ Animations.toggleInOut ]
})
export class DbnsfpComponent implements OnInit {
  @Input() variant: Variant;

  loading = false;
  data: DbNSFPData;
  rankAverage: number | null = null;

  constructor(
    private api: ApiService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.api.getDbNSFP(this.variant)
      .pipe(take(1))
      .subscribe((res) => {
        if (res && res.scores) {
          const predTools = Object.keys(res.scores) || [];
          this.rankAverage = 0;
          let toolCounts = 0;
          for (const toolName of predTools) {
            if (res.scores[toolName].rankscore) {
              this.rankAverage += res.scores[toolName].rankscore;
              ++toolCounts;
            }
          }
          this.rankAverage = toolCounts > 0 ? this.rankAverage / toolCounts : null;
        }
        this.data = res;
        this.loading = false;
      });
  }


  max(numArr: (number | null)[]): number | string {
    const filtered = numArr.filter((e) => e !== null);
    if (filtered.length) {
      return Math.max(...filtered);
    }
    return '';
  }

  maxStr(strArr: (string | null)[], method: string): string {
    const weight = METHOD_TO_INFO[method]?.weight;
    if (!weight) {
      return '';
    }
    return METHOD_TO_INFO[method]?.value[
      Math.max(
        ...(strArr.filter((e) => e !== null)
          .map((e) => weight[e]))
      )
    ] || '';
  }

  getPredLabel(str: string, method: string): string {
    const weight = METHOD_TO_INFO[method]?.weight;
    const values = METHOD_TO_INFO[method]?.value;
    return values[weight[str]] || '';
  }

  toFixed(num: number | null, digit: number): string {
    if (num.toFixed) {
      return num.toFixed(digit);
    }
    return '';
  }
}
