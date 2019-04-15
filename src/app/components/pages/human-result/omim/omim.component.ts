import { Component, OnChanges, Input, SimpleChanges } from '@angular/core';

import { ApiService } from '../../../../services/api.service';

@Component({
  selector: 'app-omim',
  templateUrl: './omim.component.html',
  styleUrls: ['./omim.component.scss']
})
export class OmimComponent implements OnChanges {
  @Input() gene;

  loading = false;
  data;

  constructor(
    private api: ApiService
  ) { }

  ngOnChanges(change: SimpleChanges) {
    console.log(change);
    if (change.gene && change.gene.currentValue && change.gene.currentValue.xref && change.gene.currentValue.xref.omimId) {
      this.loading = true;
      this.api.getOMIMByMimNumber(this.gene.xref.omimId)
        .subscribe((res) => {
          this.data = res;
          this.loading = false;
        })
    }
  }

}
