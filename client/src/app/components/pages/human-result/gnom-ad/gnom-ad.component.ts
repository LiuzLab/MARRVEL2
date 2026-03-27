import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { take } from 'rxjs/operators';

import { ApiService } from '../../../../services/api.service';
import { Variant } from '../../../../interfaces/variant';
import { GnomADVariantData } from 'src/app/interfaces/data';

@Component({
  standalone: false,
  selector: 'app-gnom-ad',
  templateUrl: './gnom-ad.component.html',
  styleUrls: ['./gnom-ad.component.scss']
})
export class GnomADComponent implements OnInit {
  @Input() variant: Variant;
  @Output() afReady = new EventEmitter<{ af: number | null; ac: number | null; homCount: number | null }>();

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
          const af = this.data.total?.alleleFreq ?? null;
          this.afReady.emit({ af, ac: this.alleleCount ?? null, homCount: this.homCount ?? null });
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
