import { Component, OnChanges, SimpleChanges, Input } from '@angular/core';

import { ModelmatcherService } from '../../../../services/modelmatcher.service';

import { HumanGene } from '../../../../interfaces/gene';
import { ModelMatcherData } from '../../../../interfaces/data';
import { TAXONIDS, TAXONID_TO_INFO } from '../../../../data/model-organisms';

@Component({
  selector: 'app-modelmatcher',
  templateUrl: './modelmatcher.component.html',
  styleUrls: ['./modelmatcher.component.scss']
})
export class ModelmatcherComponent implements OnChanges {
  @Input() gene!: HumanGene;
  data?: ModelMatcherData[];
  loading = true;

  taxonIdToInfo = TAXONID_TO_INFO;

  constructor(private mmSvc: ModelmatcherService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.gene.previousValue !== changes.gene.currentValue) {
      this.requestData(this.gene.symbol);
    }
  }

  requestData(geneSymbol: string) {
    this.loading = true;
    this.mmSvc.getScientistsByGeneSymbol(geneSymbol)
      .toPromise()
      .then((res: ModelMatcherData[]) => {
        this.data = (res || []);
        this.loading = false;
      }).catch((err: unknown) => {
        this.data = null;
        this.loading = false;
      });
  }
}
