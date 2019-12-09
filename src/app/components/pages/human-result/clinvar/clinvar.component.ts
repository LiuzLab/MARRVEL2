import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
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
  sigFourTotal;

  alleleVisible = false;

  constructor(
    private api: ApiService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.loading = true;
    this.api.getClinVarByEntrezId(this.gene.entrezId)
      .pipe(take(1))
      .subscribe((res) => {
        this.significance = { 'pathogenic': 0, 'likely pathogenic': 0, 'likely benign': 0, 'benign': 0 };
        for (const item of res) {
          item.location = '';
          if (item.chr) item.location = `Chr${item.chr}:`;
          if (item.start) item.location = item.location + `${item.start}`;
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
        this.sigFourTotal =
          this.significance['pathogenic'] + this.significance['likely pathogenic'] +
          this.significance['likely benign'] + this.significance['benign'];
        this.data = res;
        this.loading = false;
      });
  }

  getWidthPercStyle(num: number, total: number) {
    return this.sanitizer.bypassSecurityTrustStyle(`width: ${(num / total * 100).toFixed(3)}%`);
  }

}
