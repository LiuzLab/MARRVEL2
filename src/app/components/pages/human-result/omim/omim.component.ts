import { Component, OnChanges, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';

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

  @Output() dataChange: EventEmitter< any > = new EventEmitter();

  constructor(
    private api: ApiService
  ) { }

  ngOnChanges(change: SimpleChanges) {
    console.log(change);
    if (change.gene && change.gene.currentValue && change.gene.currentValue.xref && change.gene.currentValue.xref.omimId) {
      this.loading = true;
      this.dataChange.emit({
        target: 'loading',
        data: this.loading
      });
      this.api.getOMIMByMimNumber(this.gene.xref.omimId)
        .subscribe((res) => {
          this.data = res;
          this.loading = false;

          this.dataChange.emit({
            target: 'data',
            data: this.data
          });
          this.dataChange.emit({
            target: 'loading',
            data: this.loading
          });
        });
    }
  }

}
