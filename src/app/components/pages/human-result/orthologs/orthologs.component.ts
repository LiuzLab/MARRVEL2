import { Component, OnInit, Input } from '@angular/core';

import { HumanGene } from 'src/app/interfaces/gene';
import { DIOPTOrtholog } from 'src/app/interfaces/data';

import { TAXONIDS, TAXONID_TO_INFO } from 'src/app/data/model-organisms';

@Component({
  selector: 'app-orthologs',
  templateUrl: './orthologs.component.html',
  styleUrls: ['./orthologs.component.scss']
})
export class OrthologsComponent implements OnInit {
  @Input() gene: HumanGene;
  @Input() data: DIOPTOrtholog[];
  showOnlyBest = true;
  taxonIdToOrthologs = { 10090: [], 10116: [], 7955: [], 7227: [], 6239: [], 4896: [], 4932: [], 8364: [] };
  taxonIdToInfo = TAXONID_TO_INFO;

  constructor() { }

  ngOnInit() {
    if (this.data && this.data.length) {
      for (const row of this.data) {
        this.taxonIdToOrthologs[row.taxonId2].push(row);
      }
      for (const taxonId of TAXONIDS) {
        this.taxonIdToOrthologs[taxonId] = this.taxonIdToOrthologs[taxonId].sort((e1: DIOPTOrtholog, e2: DIOPTOrtholog) => {
          const norm1 = [ -e1.score, e1.bestScore, e1.bestScoreRev, e1.gene2.symbol ];
          const norm2 = [ -e2.score, e2.bestScore, e2.bestScoreRev, e2.gene2.symbol ];
          for (let i = 0; i < norm1.length; ++i) {
            if (norm1[i] < norm2[i]) {
              return -1;
            } else if (norm1[i] > norm2[i]) {
              return 1;
            }
          }
          return 0;
        });
      }
    }
  }

}
