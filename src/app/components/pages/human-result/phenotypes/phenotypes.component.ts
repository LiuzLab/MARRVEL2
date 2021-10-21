import { Component, OnInit, Input } from '@angular/core';

import { HumanGene } from '../../../../interfaces/gene';
import { Animations } from '../../../../animations';

import { CATEGORIES, CAT_TO_ICON } from '../../../../category';
const TAXONID_TO_NAME = {
  10090: 'mouse',
  10116: 'rat',
  6239: 'worm',
  7227: 'fly',
};

@Component({
  selector: 'app-phenotypes',
  templateUrl: './phenotypes.component.html',
  styleUrls: ['./phenotypes.component.scss'],
  animations: [ Animations.toggle ]
})
export class PhenotypesComponent implements OnInit {
  @Input() gene: HumanGene;
  @Input() orthologs;

  phenotypes = {};
  showOnlyBest = true;
  selected = null;
  mouseoverCat = null;

  categories = CATEGORIES;
  catNameToIcon = CAT_TO_ICON;

  orgNameToTermName = {
    human: 'Human Phenotypes',
    mouse: 'Mammalian Phenotypes',
    rat: 'Mammalian Phenotypes',
    worm: 'Worm Phenotypes'
  };

  constructor() { }

  ngOnInit() {
    if (this.gene && this.gene.phenotypes && this.gene.phenotypes.length) {
      for (const phenotype of this.gene.phenotypes) {
        if (phenotype.ontology && phenotype.ontology.categories && phenotype.ontology.categories.length) {
          for (const cat of phenotype.ontology.categories) {
            this.phenotypes['human'] = this.phenotypes['human'] || {};
            const catName = cat.name;
            if (!(catName in this.phenotypes['human'])) {
              this.phenotypes['human'][catName] = [];
            }
            this.phenotypes['human'][catName].push({
              id: phenotype.id,
              name: phenotype.ontology.name
            });
          }
        }
      }
    }

    if (this.orthologs && this.orthologs.length) {
      for (const ortholog of this.orthologs) {
        let relExists = false;
        const orgName = TAXONID_TO_NAME[ortholog['taxonId2']];
        if (orgName) {
          ortholog.gene2 = ortholog.gene2 || {};
          const aGenePheno = {};
          if (ortholog.gene2.phenotypes && ortholog.gene2.phenotypes.length) {
            for (const phenotype of ortholog.gene2.phenotypes) {
              if (phenotype.ontology && phenotype.ontology.categories && phenotype.ontology.categories.length) {
                for (const cat of phenotype.ontology.categories) {
                  const catName = cat.name;
                  if (!(catName in aGenePheno)) {
                    aGenePheno[catName] = [];
                  }
                  relExists = true;
                  aGenePheno[catName].push({
                    id: phenotype.id,
                    name: phenotype.ontology.name
                  });
                }
              }
            }
          }
          const impcPheno = {};
          const impcPhenoIds = {};
          if (ortholog.gene2.impcPhenotypes && ortholog.gene2.impcPhenotypes.length) {
            for (const pheno of ortholog.gene2.impcPhenotypes) {
              if (pheno.phenotype && pheno.phenotype.categories && pheno.phenotype.categories.length) {
                for (const cat of pheno.phenotype.categories) {
                  if (!(pheno.phenotype.id in impcPhenoIds)) {
                    impcPhenoIds[pheno.phenotype.id] = true;
                    const catName = cat.name;
                    impcPheno[catName] = impcPheno[catName] || [];
                    impcPheno[catName].push({
                      id: pheno.phenotype.id,
                      name: pheno.phenotype.name
                    });
                  }
                }
              }
            }
          }

          if (!(orgName in this.phenotypes)) {
            this.phenotypes[orgName] = [];
          }
          this.phenotypes[orgName].push({
            gene: ortholog.gene2,
            phenotypes: relExists ? aGenePheno : null,
            impcPhenotypes: ortholog.gene2.impcPhenotypes && ortholog.gene2.impcPhenotypes.length ? impcPheno : null,
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

      const orgNames = Object.keys(this.phenotypes);
      for (const orgName of orgNames) {
        if (this.phenotypes[orgName].length) {
          this.phenotypes[orgName].sort((a, b) => {
            if (a.score === b.score) {
              if (a.bestScore === b.bestScore) {
                return a.symbol < b.symbol ? -1 : 1;
              }
              return a.bestScore ? -1 : 1;
            } else {
              return a.score > b.score ? -1 : 1;
            }
          });
        }
      }
    }
  }

  selectCategory(org: string, idx: number, category: string, hover?: boolean, impc?: boolean) {
    if (!hover) {
      impc = impc || false;
      if (this.selected && this.selected.org === org && this.selected.idx === idx &&
        this.selected.category === category && this.selected === impc) {
        this.selected = null;
      } else {
        this.selected = {
          org: org,
          idx: idx,
          category: category,
          impc: impc
        };
      }
    } else {
      this.mouseoverCat = category;
    }
  }

  getTermDetailUrl(poId: string) {
    if (poId.substr(0, 3) === 'HP:') {
      return `https://hpo.jax.org/app/browse/term/${poId}`;
    }
    if (poId.substr(0, 3) === 'MP:') {
      return `http://www.informatics.jax.org/vocab/mp_ontology/${poId}`;
    }
    if (poId.substr(0, 12) === 'WBPhenotype:') {
      return `https://www.wormbase.org/species/all/phenotype/${poId}`;
    }
    if (poId.substr(0, 5) === 'FBcv:') {
      return `http://flybase.org/cgi-bin/cvreport.pl?id=${poId}`;
    }
  }

}
