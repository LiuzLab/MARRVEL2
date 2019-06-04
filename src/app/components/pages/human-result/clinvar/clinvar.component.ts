import { Component, OnChanges, Input, SimpleChanges } from '@angular/core';
import { ApiService } from '../../../../services/api.service';
import { HumanGene } from '../../../../interfaces/gene';

import { Animations } from '../../../../animations';

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
  styleUrls: ['./clinvar.component.scss'],
  animations: [ Animations.toggle ]
})
export class ClinvarComponent implements OnChanges {
  @Input() gene: HumanGene;

  loading = false;
  data;
  significance;

  alleleVisible = false;

  constructor(
    private api: ApiService
  ) { }

  ngOnChanges(change: SimpleChanges) {
    if (change.gene && change.gene.currentValue && change.gene.currentValue['entrezId']) {
      this.loading = true;
      this.api.getClinVarByEntrezId(this.gene.entrezId)
        .subscribe((res) => {
          this.significance = {};
          for (const item of res) {
            item.location = '';
            if (item.chr) item.location = `Chr${item.chr}`;
            if (item.start) item.location = item.location + `:${item.start}`;
            if (item.stop && item.start !== item.stop) {
              item.location = item.location + `-${item.stop}`;
            }
            item.significanceText = item.significance.description;
            item.reviewStatus = item.significance.reviewStatus;

            item.significanceText.split(/[\/,]/).forEach(S => {
              S = S.toLowerCase().trim();
              if (!(S in this.significance)) {
                this.significance[S] = 0;
              }
              this.significance[S] += 1;
            });
          }
          console.log(this.significance);
          this.data = res;
          this.loading = false;
        });
    }
  }

}
