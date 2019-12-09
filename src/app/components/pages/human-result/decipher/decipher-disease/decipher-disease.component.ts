import { Component, Input, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { take } from 'rxjs/operators';

import { ApiService } from 'src/app/services/api.service';

import { HumanGene } from './../../../../../interfaces/gene';
import { Variant } from 'src/app/interfaces/variant';
import { PhenotypePopulated } from 'src/app/interfaces/data';

import { CATEGORIES } from 'src/app/category';
import { Animations } from 'src/app/animations';

@Component({
  selector: 'app-decipher-disease',
  templateUrl: './decipher-disease.component.html',
  styleUrls: ['./decipher-disease.component.scss'],
  animations: [ Animations.toggleInOut ]
})
export class DecipherDiseaseComponent {
  @Input() gene: HumanGene;
  @Input() variant: Variant;

  concent = false;

  loading = false;
  data = null;

  variantTableVisible = false;
  tableTitle = '';
  dataSource: MatTableDataSource< DecipherDiseaseData > = new MatTableDataSource();
  displayedColumns = [ 'variant', 'varType', 'pathogenicity', 'inheritance' ];

  showSnvs = true;
  showCnvs = true;
  hasSnvResult = false;

  categories = CATEGORIES;
  categoryNameToCounts = null;

  constructor(private api: ApiService) { }

  getData() {
    this.loading = true;
    console.log(this.gene);
    const task = this.variant ?
      this.api.getDECIPHERDiseaseByVariant(this.variant) :
      this.api.getDECIPHERDiseaseByGenomLoc(this.gene.chr, this.gene.hg19Start, this.gene.hg19Stop);
    task
      .pipe(take(1))
      .subscribe(res => {
        console.log(res);
        this.setData(res);
        this.setTableTitle();
        this.loading = false;
      }, err => {
        this.data = null;
        this.dataSource = null;
        this.loading = false;
      });
  }

  setTableTitle() {
    this.tableTitle = `Detailed Information of `;
    if (this.variant) {
      if (this.showSnvs) {
        this.tableTitle += `Single-Nucleotide Variant ${this.variant.chr}:${this.variant.pos} ${this.variant.ref}>${this.variant.alt}`
        if (this.showCnvs) this.tableTitle += ' and ';
      }
      if (this.showCnvs) {
        this.tableTitle += `Copy-Number Variants Contain ${this.variant.chr}:${this.variant.pos}`;
      }
    } else {
      this.tableTitle += `variants on ${this.gene.symbol} (${this.gene.chr}:${this.gene.hg19Start}-${this.gene.hg19Stop})`;
    }
  }

  setData(data: DecipherDiseaseData[]) {
    data.map(D => {
      D['variant'] = `${D.hg19Chr}:${D.hg19Start}`;
      if (D.hg19Start !== D.hg19Stop) D['variant'] += `-${D.hg19Stop}`;
      if (D.ref && D.alt) D['variant'] += ` ${D.ref}>${D.alt}`;
      D['varType'] = D.cnvType === 1 ? 'CNV' : 'SNV';
      this.hasSnvResult = D.cnvType !== 1 ? true : this.hasSnvResult;
    });
    const filteredData = data.filter(D => this.showCnvs && D.cnvType === 1 || this.showSnvs && D.cnvType === -1);
    this.dataSource = new MatTableDataSource(filteredData);
    this.categoryNameToCounts = this.getCategoryCount(filteredData);
    this.data = data;
  }

  getCategoryCount(data: DecipherDiseaseData[]) {
    const counts = {};
    for (const row of data) {
      if (row.phenotypes) {
        for (const phenotype of row.phenotypes) {
          if (phenotype.ontology && phenotype.ontology.categories && phenotype.ontology.categories.length) {
            counts[phenotype.ontology.categories[0].name] = (counts[phenotype.ontology.categories[0].name] || 0) + 1;
          }
        }
      }
    }
    return counts;
  }

  onFilterChange(tag: string, value) {
    switch (tag) {
      case 'showCnvs':
        this.showCnvs = value;
        break;
      case 'showSnvs':
        this.showSnvs = value;
        break;
    }
    this.setData(this.data);
    this.setTableTitle();
  }

}

interface DecipherDiseaseData {
  hg19Chr: string;
  hg19Start: number;
  hg19Stop: number;
  ref?: string;
  alt?: string;
  genotype: string;
  pathogenicity: string;
  variantClass: string;
  cnvType: number;
  phenotypes: PhenotypePopulated[];
}
