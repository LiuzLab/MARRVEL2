import { Component, OnChanges, Input, SimpleChanges } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

import { ApiService } from '../../../../services/api.service';

import { HumanGene } from '../../../../interfaces/gene';
import { Variant } from '../../../../interfaces/variant';
import { Geno2MPResult } from '../../../../interfaces/data';

import { FUNCANNO_TO_CAT_NUM, CAT_NUM_TO_CAT_NAME } from './categories';

@Component({
  selector: 'app-geno2mp',
  templateUrl: './geno2mp.component.html',
  styleUrls: ['./geno2mp.component.scss'],
  animations: [
    trigger('toggle', [
      state('true', style({ opacity: 1 })),
      state('void', style({ opacity: 0, height: '0px' })),
      transition(':enter', animate('500ms ease-in-out')),
      transition(':leave', animate('500ms ease-in-out'))
    ])
  ]
})
export class Geno2mpComponent implements OnChanges {
  @Input() variant: Variant | null;
  @Input() gene: HumanGene | null;

  searchBy = 'gene';

  loading = false;
  variantData: Geno2MPResult;
  geneData: Geno2MPResult[];

  // For gene data
  geneSummary = { 0: 0, 1: 0, 2: 0, 3: 0 };
  geneVariantVisible = false;

  constructor(
    private api: ApiService
  ) { }

  ngOnChanges(change: SimpleChanges) {
    if (change.gene && change.gene.currentValue && this.gene.entrezId) {
      this.loading = true;
      this.api.getGeno2MPByGeneEntrezId(this.gene.entrezId)
        .subscribe((res: Geno2MPResult[]) => {
          this.geneSummary = { 0: 0, 1: 0, 2: 0, 3: 0 };
          for (let i = 0; i < res.length; ++i) {
            const catNum = FUNCANNO_TO_CAT_NUM[res[i].funcAnno];
            res[i]['categoryNum'] = catNum;
            res[i]['category'] = CAT_NUM_TO_CAT_NAME[catNum];
            res[i]['nHpoProfiles'] = res[i].hpoProfiles.length;

            this.geneSummary[catNum] += res[i].hpoProfiles.length;
          }
          console.log(res);
          this.geneData = res;
          this.loading = false;
        });
    }

    if (change.variant && change.variant.currentValue && this.variant.chr) {
      this.loading = true;
      this.api.getGeno2MPByVariant(this.variant)
        .subscribe((res: Geno2MPResult) => {
          for (let i = 0; i < res.hpoProfiles.length; ++i) {
            res.hpoProfiles[i]['broadTerm'] = res.hpoProfiles[i].broad.hpoTerm || '';
            res.hpoProfiles[i]['mediumTerm'] = res.hpoProfiles[i].medium.hpoTerm || '';
            res.hpoProfiles[i]['narrowTerm'] = res.hpoProfiles[i].narrow.hpoTerm || '';
          }
          this.variantData = res;
          this.loading = false;
        });
    }
  }

}
