import { Component, OnChanges, Input, SimpleChanges } from '@angular/core';
import { ApiService } from '../../../../services/api.service';
import { HumanGene } from '../../../../interfaces/gene';

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
  @Input() gene: HumanGene;

  loading = false;
  data;
  significance;

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
            item.location = `Chr${item.chr}:${item.start}`;
            if (item.start !== item.stop) {
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
          this.data = res;
          this.loading = false;
        });
    }
  }

}
