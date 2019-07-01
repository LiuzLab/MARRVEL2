import { Component, Input, SimpleChanges, OnInit } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { take } from 'rxjs/operators';

import { ApiService } from '../../../../services/api.service';

import { HumanGene } from '../../../../interfaces/gene';
import { Variant } from '../../../../interfaces/variant';
import { Geno2MPResult } from '../../../../interfaces/data';

import { Animations } from './../../../../animations';
import { FUNCANNO_TO_CAT_NUM, CAT_NUM_TO_CAT_NAME } from './categories';
import { HPO_BROAD_TO_CAT } from '../../../../category';

@Component({
  selector: 'app-geno2mp',
  templateUrl: './geno2mp.component.html',
  styleUrls: ['./geno2mp.component.scss'],
  animations: [ Animations.toggleInOut ]
})
export class Geno2mpComponent implements OnInit {
  @Input() variant: Variant | null;
  @Input() gene: HumanGene | null;

  searchBy = 'gene';

  loading = false;
  variantData: Geno2MPResult;
  geneData: Geno2MPResult[];

  phenotypes: object;

  // For variant data
  includeRelated = false;

  // For gene data
  geneSummary = { 0: 0, 1: 0, 2: 0, 3: 0 };
  geneVariantVisible = false;
  varCategoryNames = [ 'Non-Coding', 'Synonymous/Unknown', 'Missense/Other Indel', 'Splice/Frameshift/Nonsense/Stop Loss' ];
  varCategoriesVisible = {
    'Non-Coding': false,
    'Synonymous/Unknown': false,
    'Missense/Other Indel': true,
    'Splice/Frameshift/Nonsense/Stop Loss': true
  };

  constructor(
    private api: ApiService
  ) { }

  ngOnInit() {
    if (this.gene) {
      this.loading = true;
      this.api.getGeno2MPByGeneEntrezId(this.gene.entrezId)
        .pipe(take(1))
        .subscribe((res: Geno2MPResult[]) => {
          this.geneSummary = { 0: 0, 1: 0, 2: 0, 3: 0 };
          for (let i = 0; i < res.length; ++i) {
            const catNum = FUNCANNO_TO_CAT_NUM[res[i].funcAnno];
            res[i]['categoryNum'] = catNum;
            res[i]['category'] = CAT_NUM_TO_CAT_NAME[catNum];
            res[i]['nHpoProfiles'] = res[i].hpoProfiles.length;

            this.geneSummary[catNum] += res[i].hpoProfiles.length;
          }
          this.geneData = res;
          this.loading = false;
          this.countPhenotypes(this.geneData);
        });
    }

    if (this.variant && this.variant.chr) {
      this.loading = true;
      this.api.getGeno2MPByVariant(this.variant)
        .pipe(take(1))
        .subscribe((res: Geno2MPResult) => {
          if (res && res.hpoProfiles) {
            for (let i = 0; i < res.hpoProfiles.length; ++i) {
              res.hpoProfiles[i]['broadTerm'] = res.hpoProfiles[i].broad.hpoTerm || '';
              res.hpoProfiles[i]['mediumTerm'] = res.hpoProfiles[i].medium.hpoTerm || '';
              res.hpoProfiles[i]['narrowTerm'] = res.hpoProfiles[i].narrow.hpoTerm || '';
            }
          }
          this.variantData = res;
          this.loading = false;
        });
    }
  }

  countPhenotypes(variants: Geno2MPResult[]) {
    const phenotypes = {};
    for (const variant of variants) {
      if (this.varCategoriesVisible[variant['category']]) {
        for (const hpoProfile of variant.hpoProfiles) {
          if (hpoProfile.affectedStatus === 'affected') {
            for (const hpoId of hpoProfile.broad.hpoIds) {
              const catName = HPO_BROAD_TO_CAT[hpoId];
              phenotypes[catName] = (phenotypes[catName] || 0) + 1;
            }
          }
        }
      }
    }
    this.phenotypes = phenotypes;
  }

  onCategoryChange(catName, e: MatSlideToggleChange) {
    this.varCategoriesVisible[catName] = e.checked;
    this.countPhenotypes(this.geneData);
  }

}
