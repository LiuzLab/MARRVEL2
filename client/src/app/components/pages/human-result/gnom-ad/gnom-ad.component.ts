import { Component, OnInit, Input } from '@angular/core';
import { take } from 'rxjs/operators';

import { ApiService } from '../../../../services/api.service';
import { Variant } from '../../../../interfaces/variant';
import { GnomADVariantData } from 'src/app/interfaces/data';

@Component({
  selector: 'app-gnom-ad',
  templateUrl: './gnom-ad.component.html',
  styleUrls: ['./gnom-ad.component.scss']
})
export class GnomADComponent implements OnInit {
  @Input() variant: Variant;

  loading = false;
  data: GnomADVariantData;
  alleleCount?: number;
  homCount?: number;

  constructor(private api: ApiService) { }

  ngOnInit() {
    if (this.variant) {
      this.loading = true;
      this.api.getGnomADVaraint(this.variant)
        .pipe(take(1))
        .subscribe((res) => {
          this.data = res;
          this.alleleCount = (this.data.exome?.alleleCount || 0) +
            (this.data.genome?.alleleCount || 0);
          this.homCount = (this.data.exome?.homCount || 0) +
            (this.data.genome?.homCount || 0);
          this.loading = false;
        });
    }
  }

  retUnlNull(mightNum: number | null | undefined, retValIfNull: any): number | string {
    if (mightNum != null && !isNaN(mightNum)) {
      return mightNum;
    }
    return retValIfNull;
  }
}
