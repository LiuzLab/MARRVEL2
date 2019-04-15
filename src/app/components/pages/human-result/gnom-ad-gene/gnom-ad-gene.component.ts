import { Component, OnChanges, Input, SimpleChanges } from '@angular/core';

import { ApiService } from '../../../../services/api.service';
import { HumanGene } from '../../../../interfaces/gene';

@Component({
  selector: 'app-gnom-ad-gene',
  templateUrl: './gnom-ad-gene.component.html',
  styleUrls: ['./gnom-ad-gene.component.scss']
})
export class GnomADGeneComponent implements OnChanges {
  @Input() gene: HumanGene;

  loading = false;
  data: GnomADGeneSummary;

  constructor(
    private api: ApiService
  ) { }

  ngOnChanges(change: SimpleChanges) {
    if (change.gene && change.gene.currentValue && this.gene.entrezId) {
      this.loading = true;
      this.api.getGnomADGeneByEntrezId(this.gene.entrezId)
        .subscribe((res) => {
          this.data = res;
          this.loading = false;
        });
    }
  }

}

interface GnomADGeneSummary {
  ensemblId: string;
  mis: {
    oeLower: number | null;
    oeUpper: number | null;
    obs: number | null;
    oe: number | null;
    exp: number | null;
    z: number | null;
  };
  syn: {
    oeLower: number | null;
    oeUpper: number | null;
    obs: number | null;
    oe: number | null;
    exp: number | null;
    z: number | null;
  };
  lof: {
    oeLower: number | null;
    oeUpper: number | null;
    oe: number | null;
    obs: number | null;
    exp: number | null;
    z: number | null;
    pLI: number | null;
  };
}
