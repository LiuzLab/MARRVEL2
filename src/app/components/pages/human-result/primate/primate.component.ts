import { Component, Input, OnInit } from '@angular/core';

import { HumanGene } from 'src/app/interfaces/gene';
import { PrimateData } from 'src/app/interfaces/data';
import { Variant } from 'src/app/interfaces/variant';
import { Animations } from 'src/app/animations';

import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-primate',
  templateUrl: './primate.component.html',
  styleUrls: ['./primate.component.scss'],
  animations: [ Animations.toggleInOut ]
})
export class PrimateComponent implements OnInit {
  @Input() variant: Variant;
  @Input() gene: HumanGene;

  searchBy = 'variant';

  loading = true;
  data: PrimateData;
  geneLoading = true;
  dataByGene: any[];

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    if (this.variant) {
      this.loading = true;
      this.apiService.getPrimateByVariant(this.variant)
        .subscribe((res: PrimateData) => {
          this.data = res;
          this.loading = false;
        }, (err) => {
          console.log(err);
          this.data = null;
          this.loading = false;
        });
    } else {
      this.searchBy = this.gene ? 'gene' : 'variant';
      this.data = null;
      this.loading = false;
    }

    if (this.gene) {
      this.geneLoading = true;
      this.apiService.getPrimateByGene(this.gene)
        .subscribe((res) => {
          this.dataByGene = (res || []).map((e: PrimateData) => {
            return {
              variant: `${e.chr}:${e.pos} ${e.ref}>${e.alt}`,
              alleleCount: e.AC,
              alleleNum: e.AN,
              alleleFreq: e.AF,
              dataSource: 'HGSC'
            }
          });
          this.geneLoading = false;
        }, (err) => {
          console.log(err);
          this.dataByGene = [];
          this.geneLoading = false;
        });
    } else {
      this.geneLoading = false;
    }
  }

}
