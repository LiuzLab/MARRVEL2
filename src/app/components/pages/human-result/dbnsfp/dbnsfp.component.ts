import { Component, OnChanges, Input, SimpleChanges } from '@angular/core';

import { Variant } from './../../../../interfaces/variant';
import { ApiService } from '../../../../services/api.service';
import { DbNSFPData } from 'src/app/interfaces/data';

@Component({
  selector: 'app-dbnsfp',
  templateUrl: './dbnsfp.component.html',
  styleUrls: ['./dbnsfp.component.scss']
})
export class DbnsfpComponent implements OnChanges {
  @Input() variant: Variant;

  loading = false;
  data: DbNSFPData;

  constructor(
    private api: ApiService
  ) { }

  ngOnChanges(change: SimpleChanges) {
    if (change.variant && change.variant.currentValue && this.variant.chr) {
      this.loading = true;
      this.api.getDbNSFP(this.variant)
        .subscribe((res) => {
          this.data = this.changePredictionLabel(res);
          this.loading = false;
        });
    }
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
