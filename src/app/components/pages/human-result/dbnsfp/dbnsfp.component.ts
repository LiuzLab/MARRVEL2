import { Component, OnInit, Input } from '@angular/core';
import { take } from 'rxjs/operators';

import { Variant } from './../../../../interfaces/variant';
import { ApiService } from '../../../../services/api.service';
import { DbNSFPData } from 'src/app/interfaces/data';
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
        this.data = this.changePredictionLabel(res);
        this.loading = false;
      });
  }

  changePredictionLabel(res) {
    if (res && res.scores) {
      if (res.scores.MCAP.prediction === 'T') {
        res.scores.MCAP.prediction = 'Tolerated';
      }
      else if (res.scores.MCAP.prediction === 'D') {
        res.scores.MCAP.prediction = 'Damaging';
      }

      if (res.scores.Polyphen2HDIV.prediction === 'B') {
        res.scores.Polyphen2HDIV.prediction = 'Benign';
      }
      else if (res.scores.Polyphen2HDIV.prediction === 'P') {
        res.scores.Polyphen2HDIV.prediction = 'Possibly Damaging';
      }
      else if (res.scores.Polyphen2HDIV.prediction === 'D') {
        res.scores.Polyphen2HDIV.prediction = 'Probably Damaging';
      }

      if (res.scores.Polyphen2HVAR.prediction === 'B') {
        res.scores.Polyphen2HVAR.prediction = 'Benign';
      }
      else if (res.scores.Polyphen2HVAR.prediction === 'P') {
        res.scores.Polyphen2HVAR.prediction = 'Possibly Damaging';
      }
      else if (res.scores.Polyphen2HVAR.prediction === 'D') {
        res.scores.Polyphen2HVAR.prediction = 'Probably Damaging';
      }
    }
    return res;
  }

}
