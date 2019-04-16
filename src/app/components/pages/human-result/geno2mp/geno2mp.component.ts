import { Component, OnChanges, Input, SimpleChanges, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

import { ApiService } from '../../../../services/api.service';

import { HumanGene } from '../../../../interfaces/gene';
import { Variant } from '../../../../interfaces/variant';

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
export class Geno2mpComponent implements OnChanges, OnInit {
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

  ngOnInit() {
  }
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

            this.geneSummary[catNum] += 1;
          }
          this.geneData = res;
          this.loading = false;

          console.log(this.geneData);
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
          console.log(res);
          this.variantData = res;
          this.loading = false;
        });
    }
  }


}

interface Geno2MPResult {
  hg19Chr: string;
  hg19Pos: number;
  ref: string;
  alt: string;
  genes: [{
    entrezId: number;
    symbol: string;
  }];
  homCount: number;
  hetCount: number;
  hpoCount: number;
  hpoProfiles: [{
    narrow: {
      hpoId: string;
      hpoTerm: string;
    },
    medium: {
      hpoId: string;
      hpoTerm: string;
    },
    broad: {
      hpoId: string;
      hpoTerm: string;
    },
    affectedStatus: string;
  }];
  funcAnno: string;
}
