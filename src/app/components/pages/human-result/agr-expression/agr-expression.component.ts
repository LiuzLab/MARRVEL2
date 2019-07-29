import { Component, OnInit, Input } from '@angular/core';

import { HumanGene } from 'src/app/interfaces/gene';
import { ApiService } from 'src/app/services/api.service';
import { take } from 'rxjs/operators';

import { AGR_EXP_TERMS } from './agr-expression-terms';

@Component({
  selector: 'app-agr-expression',
  templateUrl: './agr-expression.component.html',
  styleUrls: ['./agr-expression.component.scss']
})
export class AgrExpressionComponent implements OnInit {
  @Input() gene: HumanGene;

  loading = true;
  data;
  showOnlyBest = true;

  expressionTerms = AGR_EXP_TERMS;
  hoverTerm: string | null = null;
  taxonIdToInfo = {
    7227: {
      name: 'Fly',
      icon: '../../../../../assets/icons/005-fly.svg'
    },
    6239: {
      name: 'Worm',
      icon: '../../../../../assets/icons/006-worm.svg'
    },
    7955: {
      name: 'Zebrafish',
      icon: '../../../../../assets/icons/004-fish.svg'
    },
    10090: {
      name: 'Mouse',
      icon: '../../../../../assets/icons/002-mouse.svg'
    },
    10116: {
      name: 'Rat',
      icon: '../../../../../assets/icons/003-rat.svg'
    },
    4896: {
      name: 'Fission Yeast',
      icon: '../../../../../assets/icons/008-fyeast.svg'
    },
    4932: {
      name: 'Budding Yeast',
      icon: '../../../../../assets/icons/007-yeast.svg'
    },
  };
  taxonIds = [ 10090, 10116, 7955, 7227, 6239, 4932, 4896 ];

  constructor(
    private api: ApiService
  ) { }

  ngOnInit() {
    this.api.getAgrExpByEntrezId(this.gene.entrezId)
      .pipe(take(1))
      .subscribe(res => {
        this.loading = false;
        this.data = this.parseData(res);
      }, err => {
        this.loading = false;
        this.data = null;
      });
  }

  parseData(data: AgrExpData[]) {
    const res = {};
    for (const row of data) {
      if (!row.gene2) continue;
      const D = {
        symbol: row.gene2.symbol,
        xref: row.gene2.xref,
        url: this.getUrl(row.gene2),
        taxonId: row.taxonId2,
        score: row.score,
        bestScore: row.bestScore,
        expression: {}
      };
      for (const group of row.gene2.agrExpressions.expressionSummary.groups) {
        for (const term of group.terms) {
          D.expression[term.name] = term.numberOfAnnotations;
        }
      }
      res[row.taxonId2] = res[row.taxonId2] || [];
      res[row.taxonId2].push(D);
    }
    return res;
  }

  getUrl(gene) {
    switch (gene.taxonId) {
      case 10090:
        return `http://www.informatics.jax.org/marker/${gene['mgiId']}`;
      case 10116:
        return `http://rgd.mcw.edu/rgdweb/report/gene/main.html?id=${gene['rgdId']}`;
      case 7955:
        return `http://zfin.org/action/marker/view/${gene['zfinId']}`;
      case 4932:
        return `http://www.yeastgenome.org/locus/${gene['sgdId']}`;
      case 4896:
        return `https://www.pombase.org/gene/${gene['pomBaseId']}`;
      case 7227:
        return `http://flybase.org/reports/${gene['flyBaseId']}.html`;
      case 6239:
        return `http://www.wormbase.org/species/c_elegans/gene/${gene['wormBaseId']}`;
    }
    return '';
  }
}

interface AgrExpData {
  taxonId2: number;
  score: number;
  bestScore: boolean;
  gene2: {
    entrezId: number;
    symbol: string;
    mgiId?: string,
    xref: object;
    agrExpressions: {
      expressionSummary: {
        totalAnnotations: number;
        groups: [{
          totalAnnotations: number;
          name: string;
          terms: [{
            id: string,
            numberOfAnnotations: number;
            name: string;
          }];
        }];
      };
    };
  };
}
