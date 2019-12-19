import { Component, OnInit, Input } from '@angular/core';

import { HumanGene } from 'src/app/interfaces/gene';
import { DIOPTOrtholog } from 'src/app/interfaces/data';

@Component({
  selector: 'app-orthologs',
  templateUrl: './orthologs.component.html',
  styleUrls: ['./orthologs.component.scss']
})
export class OrthologsComponent implements OnInit {
  @Input() gene: HumanGene;
  @Input() data: DIOPTOrtholog[];
  showOnlyBest = true;
  taxonIdToOrthologs = { 10090: [], 10116: [], 7955: [], 7227: [], 6239: [], 4896: [], 4932: [] };
  taxonIdToInfo = {
    7227: {
      name: 'Fly',
      icon: '../../../../../assets/icons/fly.svg',
      maxScore: 16
    },
    6239: {
      name: 'Worm',
      icon: '../../../../../assets/icons/worm.svg',
      maxScore: 16
    },
    7955: {
      name: 'Zebrafish',
      icon: '../../../../../assets/icons/fish.svg',
      maxScore: 15
    },
    10090: {
      name: 'Mouse',
      icon: '../../../../../assets/icons/mouse.svg',
      maxScore: 16
    },
    10116: {
      name: 'Rat',
      icon: '../../../../../assets/icons/rat.svg',
      maxScore: 14
    },
    4896: {
      name: 'Fission Yeast',
      icon: '../../../../../assets/icons/fyeast.svg',
      maxScore: 12
    },
    4932: {
      name: 'Budding Yeast',
      icon: '../../../../../assets/icons/yeast.svg',
      maxScore: 15
    }
  };

  constructor() { }

  ngOnInit() {
    if (this.data && this.data.length) {
      for (const row of this.data) {
        this.taxonIdToOrthologs[row.taxonId2].push(row);
      }
      for (const taxonId of [ 10090, 10116, 7955, 7227, 6239, 4896, 4932 ]) {
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
