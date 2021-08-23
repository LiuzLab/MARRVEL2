import { Component, OnInit, Input } from '@angular/core';

import { HumanGene } from 'src/app/interfaces/gene';
import { ApiService } from 'src/app/services/api.service';
import { take } from 'rxjs/operators';

import { AGR_EXP_TERMS } from './agr-expression-terms';
import { Animations } from 'src/app/animations';

@Component({
  selector: 'app-agr-expression',
  templateUrl: './agr-expression.component.html',
  styleUrls: ['./agr-expression.component.scss'],
  animations: [ Animations.toggle ]
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
      icon: '../../../../../assets/icons/yeast.svg',
      maxScore: 12
    },
    4932: {
      name: 'Budding Yeast',
      icon: '../../../../../assets/icons/yeast.svg',
      maxScore: 15
    }
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
      if (row.gene2.agrExpressions && row.gene2.agrExpressions.expressionSummary) {
        for (const group of row.gene2.agrExpressions.expressionSummary.groups) {
          for (const term of group.terms) {
            D.expression[term.name] = term.numberOfAnnotations;
          }
        }
      }
      res[row.taxonId2] = res[row.taxonId2] || [];
      res[row.taxonId2].push(D);
    }

    for (const taxonId of this.taxonIds) {
      if (!res[taxonId] || !res[taxonId].length) {
        continue;
      }
      res[taxonId].sort((a, b) => {
        if (a.score === b.score) {
          if (b.bestScore === b.bestScore) {
            return a.symbol < b.symbol ? -1 : 1;
          }
          return a.bestScore ? -1 : 1;
        } else {
          return a.score > b.score ? -1 : 1;
        }
      });
    }
    return res;
  }

  getUrl(gene) {
    if ('mgiId' in gene) return `http://www.informatics.jax.org/marker/${gene['mgiId']}`;
    if ('rgdId' in gene) return `http://rgd.mcw.edu/rgdweb/report/gene/main.html?id=${gene['rgdId']}`;
    if ('zfinId' in gene) return `http://zfin.org/action/marker/view/${gene['zfinId']}`;
    if ('sgdId' in gene) return `http://www.yeastgenome.org/locus/${gene['sgdId']}`;
    if ('pomBaseId' in gene) return `https://www.pombase.org/gene/${gene['pomBaseId']}`;
    if ('flyBaseId' in gene) return `http://flybase.org/reports/${gene['flyBaseId']}.html`;
    if ('wormBaseId' in gene) return `http://www.wormbase.org/species/c_elegans/gene/${gene['wormBaseId']}`;
    return '';
  }

  mouseChange(term: string | null) {
    this.hoverTerm = term;
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
