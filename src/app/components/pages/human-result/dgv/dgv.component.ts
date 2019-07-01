import { Component, OnInit, Input } from '@angular/core';
import { take } from 'rxjs/operators';

import { ApiService } from '../../../../services/api.service';

import { HumanGene } from '../../../../interfaces/gene';
import { Variant } from '../../../../interfaces/variant';

@Component({
  selector: 'app-dgv',
  templateUrl: './dgv.component.html',
  styleUrls: ['./dgv.component.scss']
})
export class DgvComponent implements OnInit {
  @Input() variant: Variant;
  @Input() gene: HumanGene;

  searchBy = 'gene';
  data: Geno2MPData[];
  loading = false;

  tableTitle: string;

  constructor(
    private api: ApiService
  ) { }

  ngOnInit() {
    if (this.gene && this.gene.entrezId) {
      if (this.searchBy === 'gene') {
        this.loading = true;
        this.data = null;
        this.api.getDGVByEntrezId(this.gene.entrezId)
          .pipe(take(1))
          .subscribe((res) => {
            this.tableTitle = `Copy Number Variation In Control Population of ${this.gene.symbol} from DGV`;
            this.data = this.processGeno2MPData(res);
            this.loading = false;
          });
      }
    }
    if (this.variant && this.variant.chr) {
      if (!this.gene && this.searchBy === 'gene') {
        this.searchBy = 'variant';
      }

      if (this.searchBy === 'variant') {
        this.loading = true;
        this.data = null;
        this.api.getDGVByVariant(this.variant)
          .pipe(take(1))
          .subscribe((res) => {
            this.tableTitle = `Copy Number Variation In Control Population of ${this.variant.chr}:${this.variant.pos} from DGV`;
            this.data = this.processGeno2MPData(res);
            this.loading = false;
          });
      }
    }
  }


  processGeno2MPData(data) {
    for (let i = 0; i < data.length; ++i) {
      data[i].geneSymbols = data[i].genes.map(e => e.symbol).join(', ');
      data[i].size = data[i].hg19Stop - data[i].hg19Start + 1;
      data[i].gain = data[i].gain || 0;
      data[i].loss = data[i].loss || 0;
      data[i].frequency = data[i].freqeuncy || ((data[i].gain + data[i].loss) / data[i].sampleSize);
      data[i].reference = (data[i].reference || '').replace('PMID:', '');
    }
    return data;
  }

}

interface Geno2MPData {
  hg19Chr: string;
  hg19Start: number;
  hg19Stop: number;
  length?: number;
  type: string;
  subType: string;
  accession?: string;
  frequency?: number;
  gain: number;
  loss: number;
  sampleSize: number;
  reference?: string;
  genes: [{
    entrezId: number;
    symbol: string;
  }];
}
