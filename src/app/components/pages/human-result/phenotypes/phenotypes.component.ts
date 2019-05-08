import { Component, OnChanges, Input, SimpleChanges } from '@angular/core';

import { HumanGene } from '../../../../interfaces/gene';
import { Animations } from '../../../../animations';

import { CATEGORIES, CAT_TO_ICON } from '../../../../category';
const TAXONID_TO_NAME = {
  10090: 'mouse',
  6239: 'worm'
};

@Component({
  selector: 'app-phenotypes',
  templateUrl: './phenotypes.component.html',
  styleUrls: ['./phenotypes.component.scss'],
  animations: [ Animations.toggle ]
})
export class PhenotypesComponent implements OnChanges {
  @Input() gene: HumanGene;
  @Input() orthologs;

  phenotypes = {};
  showOnlyBest = true;
  selected = null;
  mouseoverCat = null;

  height = 60;
  bestHeight = 60;

  categories = CATEGORIES;
  catNameToIcon = CAT_TO_ICON;

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.gene && changes.gene.currentValue) {
      if (this.gene.phenotypes) {
        this.phenotypes['human'] = {};
        for (const phenotype of this.gene.phenotypes) {
          if (phenotype.ontology && phenotype.ontology.category) {
            const catName = phenotype.ontology.category.name;
            if (!(catName in this.phenotypes['human'])) {
              this.phenotypes['human'][catName] = [];
            }
            this.phenotypes['human'][catName].push({
              id: phenotype.id,
              name: phenotype.ontology.name
            });
          }
        }

        console.log(this.phenotypes);
      }
    }

    if (changes.orthologs && changes.orthologs.currentValue) {
      this.height = this.bestHeight = 60;
      for (const ortholog of this.orthologs) {
        const orgName = TAXONID_TO_NAME[ortholog['taxonId2']];
        if (orgName) {
          this.height += 26;
          this.bestHeight += (ortholog.bestScore ? 26 : 0);
          if (ortholog.bestScore) {
            console.log(' >', ortholog);
          }
          const aGenePheno = {};
          for (const phenotype of ortholog.gene2.phenotypes) {
            if (phenotype.ontology && phenotype.ontology.category) {
              const catName = phenotype.ontology.category.name;
              if (!(catName in aGenePheno)) aGenePheno[catName] = [];
              aGenePheno[catName].push({
                id: phenotype.id,
                name: phenotype.ontology.name
              });
            }
          }

          if (!(orgName in this.phenotypes)) this.phenotypes[orgName] = [];
          this.phenotypes[orgName].push({
            gene: ortholog.gene2,
            phenotypes: aGenePheno,
            score: ortholog.score,
            bestScore: ortholog.bestScore
          });
        }
      }

      if (this.phenotypes['mouse']) {
        this.phenotypes['mouse'].sort((a, b) => a.score < b.score ? 1 : a.score > b.score ? -1 : 0);
      }
      if (this.phenotypes['worm']) {
        this.phenotypes['worm'].sort((a, b) => a.score < b.score ? 1 : a.score > b.score ? -1 : 0);
      }
      console.log(this.phenotypes);
    }
  }

  selectCategory(org: string, idx: number, category: string, hover?: boolean) {
    if (!hover) {
      if (this.selected && this.selected.org === org && this.selected.idx === idx && this.selected.category === category) {
        this.selected = null;
      }
      else {
        this.selected = {
          org: org,
          idx: idx,
          category: category
        };
      }
    }
    else {
      this.mouseoverCat = category;
    }
  }

}
