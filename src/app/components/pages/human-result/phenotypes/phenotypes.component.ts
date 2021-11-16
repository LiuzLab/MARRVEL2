import { Component, OnInit, Input } from '@angular/core';

import { HumanGene } from '../../../../interfaces/gene';
import { Animations } from '../../../../animations';

import { CATEGORIES, CAT_TO_ICON } from '../../../../category';
import { TAXONID_TO_INFO } from 'src/app/data/model-organisms';

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

  taxonIdToInfo = TAXONID_TO_INFO;
  taxonIds = [ 9606, 10090, 10116, 7227, 6239 ];

  constructor() { }

  ngOnInit() {
    if (this.gene) {
      this.phenotypes[9606] = this.phenotypes[9606] || [{ gene: this.gene, bestScore: true, phenotypes: null }];
      if (this.gene.phenotypes && this.gene.phenotypes.length && this.gene.phenotypes[0].id) {
        this.phenotypes[9606][0].phenotypes = {};
        for (const phenotype of this.gene.phenotypes) {
          if (phenotype.ontology && phenotype.ontology.categories && phenotype.ontology.categories.length) {
            for (const cat of phenotype.ontology.categories) {
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
                if (aGenePheno[catName].filter((pheno) => pheno.id === phenotype.ontology.id).length === 0) {
                  aGenePheno[catName].push({
                    id: phenotype.ontology.id,
                    name: phenotype.ontology.name
                  });
                }
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
    }

    for (const taxonId of this.taxonIds) {
      if (!(taxonId in this.phenotypes)) {
        continue;
      }
      for (const ortholog of this.phenotypes[taxonId]) {
        for (const phenotypes of [ ortholog.phenotypes, ortholog.impcPhenotypes ]) {
          if (!phenotypes) {
            continue;
          }
          const catNames = Object.keys(phenotypes);
          for (const category of catNames) {
            phenotypes[category].sort((onto1, onto2) => {
              return onto1.name < onto2.name ? -1 : 1;
            });
          }
        }
      }
    }
  }

  selectCategory(taxonId: number, idx: number, category: string, hover?: boolean, impc?: boolean) {
    if (!hover) {
      impc = impc || false;
      if (this.selected && this.selected.taxonId === taxonId && this.selected.idx === idx &&
        this.selected.category === category && this.selected === impc) {
        this.selected = null;
      } else {
        this.selected = {
          taxonId: taxonId,
          idx: idx,
          category: category,
          impc: impc
        };
      }
    } else {
      this.mouseoverCat = category;
    }
  }

  getTermDetailUrl(taxonId: number, term: any, isGene: boolean) {
    switch (taxonId) {
      case 9606:
        return isGene ? `https://hpo.jax.org/app/browse/gene/${term.entrezId}` :
          `https://hpo.jax.org/app/browse/term/${term}`;
      case 10090:
        return isGene ?  `http://www.informatics.jax.org/marker/${term.mgiId}` :
          `http://www.informatics.jax.org/vocab/mp_ontology/${term}`;
      case 10116:
        return isGene ? `https://rgd.mcw.edu/rgdweb/report/gene/main.html?id=${term.rgdId}` :
          `http://www.informatics.jax.org/vocab/mp_ontology/${term}`;
      case 6239:
        return isGene ? `https://wormbase.org/species/c_elegans/gene/${term.wormBaseId}` :
          `https://www.wormbase.org/species/all/phenotype/${term}`;
      case 7227:
        return isGene ? `https://flybase.org/reports/${term.flyBaseId}` :
          `http://flybase.org/cgi-bin/cvreport.pl?id=${term}`;
    }
  }
}
