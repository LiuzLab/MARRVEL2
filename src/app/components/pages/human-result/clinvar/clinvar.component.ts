import { Component, OnChanges, Input } from '@angular/core';

interface ClinVarVariant {
  variantion: string;
  location: string;
  conditions: string;
  significance: string;
  status: string;
}

@Component({
  selector: 'app-clinvar',
  templateUrl: './clinvar.component.html',
  styleUrls: ['./clinvar.component.scss']
})
export class ClinvarComponent implements OnChanges {
  @Input() data;
  @Input() gene;
  significance;

  constructor() { }

  ngOnChanges() {
    if (this.data) {
      this.significance = {};
      for (const item of this.data) {
        item.location = `Chr${item.chr}:${item.start}`;
        if (item.start !== item.stop) {
          item.location = item.location + `-${item.stop}`;
        }
        item.significanceText = item.significance.description;
        item.reviewStatus = item.significance.reviewStatus;

        item.significanceText.split('/').forEach(S => {
          S = S.toLowerCase();
          if (!(S in this.significance)) {
            this.significance[S] = 0;
          }
          this.significance[S] += 1;
        });
      }
    }
  }

}
