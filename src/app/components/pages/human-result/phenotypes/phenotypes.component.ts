import { Component, OnInit, Input } from '@angular/core';

import { HumanGene } from '../../../../interfaces/gene';
import { Animations } from '../../../../animations';

import { CATEGORIES, CAT_TO_ICON } from '../../../../category';
import { TAXONID_TO_INFO } from 'src/app/data/diopt';
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

  orgNames = [ 'mouse', 'rat', 'fly', 'worm' ];
  orgNameToTermName = {
    human: 'Human Phenotypes',
    mouse: 'Mammalian Phenotypes',
    rat: 'Mammalian Phenotypes',
    worm: 'Worm Phenotypes'
  };
  taxonIdToInfo = TAXONID_TO_INFO;
  taxonIds = [ 9606, 10090, 10116, 7227, 6239 ];

  constructor() { }

  ngOnInit() {
    if (this.gene && this.gene.phenotypes && this.gene.phenotypes.length) {
      console.log(this.gene.phenotypes);
      for (const phenotype of this.gene.phenotypes) {
        if (phenotype.ontology && phenotype.ontology.categories && phenotype.ontology.categories.length) {
          for (const cat of phenotype.ontology.categories) {
            this.phenotypes[9606] = this.phenotypes[9606] || [{ gene: this.gene, bestScore: true, phenotypes: {} }];
            const catName = cat.name;
            if (!(catName in this.phenotypes[9606][0].phenotypes)) {
              this.phenotypes[9606][0].phenotypes[catName] = [];
            }
            this.phenotypes[9606][0].phenotypes[catName].push({
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
        const taxonId = ortholog['taxonId2'];
        ortholog.gene2 = ortholog.gene2 || {};
        const phenoCats = [];
        for (const phenotypes of [ ortholog.gene2.phenotypes, ortholog.gene2.impcPhenotypes ]) {
          if (!phenotypes || !phenotypes.length) {
            continue;
          }
          const aGenePheno = {};
          for (const phenotype of phenotypes) {
            phenotype.ontology = phenotype.ontology || phenotype.phenotype;
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
          phenoCats.push(aGenePheno);
        }
        this.phenotypes[taxonId] = this.phenotypes[taxonId] || [];
        this.phenotypes[taxonId].push({
          gene: ortholog.gene2,
          phenotypes: relExists ? phenoCats[0] : null,
          impcPhenotypes: ortholog.gene2.impcPhenotypes && ortholog.gene2.impcPhenotypes.length ? phenoCats[1] : null,
          score: ortholog.score,
          bestScore: ortholog.bestScore
        });
      }

      for (const taxonId of this.taxonIds) {
        if (this.phenotypes[taxonId] && this.phenotypes[taxonId].length) {
          this.phenotypes[taxonId].sort((a, b) => {
            if (a.score === b.score) {
              if (a.bestScore === b.bestScore) {
                return a.symbol < b.symbol ? -1 : 1;
              }
              return a.bestScore ? -1 : 1;
            } else {
              return a.score > b.score ? -1 : 1;
            }
          });
        } else {
          this.phenotypes[taxonId] = [];
        }
      }
      console.log(this.phenotypes);
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

  getTermDetailUrl(poId: string, gene?: any) {
    if (poId === null) {
      if (gene.hgncId) {
        return `https://www.genenames.org/data/gene-symbol-report/#!/hgnc_id/HGNC:${gene.hgncId}`;
      }
      if (gene.mgiId) {
        return `http://www.informatics.jax.org/marker/${gene.mgiId}`;
      }
    } else {
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

}
