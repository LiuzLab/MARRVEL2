import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { take } from 'rxjs/operators';

import { ApiService } from '../../../../services/api.service';
import { HumanGene } from '../../../../interfaces/gene';

import { Animations } from '../../../../animations';

@Component({
  selector: 'app-clinvar',
  templateUrl: './clinvar.component.html',
  styleUrls: ['./clinvar.component.scss'],
  animations: [ Animations.toggle ]
})
export class ClinvarComponent implements OnInit {
  @Input() gene: HumanGene;

  loading = false;
  data;
  significance;

  alleleVisible = false;

  constructor(
    private api: ApiService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.api.getClinVarByEntrezId(this.gene.entrezId)
      .pipe(take(1))
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
