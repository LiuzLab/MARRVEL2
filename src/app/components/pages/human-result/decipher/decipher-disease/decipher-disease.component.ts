import { Component, OnChanges, Input, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material';

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
export class DecipherDiseaseComponent implements OnChanges {
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
  showCnvs = false;

  categories = CATEGORIES;
  categoryNameToCounts = null;

  constructor(private api: ApiService) { }

  ngOnChanges(changes: SimpleChanges) {
  }

  getData() {
    this.loading = true;
    this.api.getDECIPHERDiseaseByVariant(this.variant)
      .subscribe(res => {
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
    if (this.showSnvs) {
      this.tableTitle += `Single-Nucleotide Variant ${this.variant.chr}:${this.variant.pos} ${this.variant.ref}>${this.variant.alt}`
      if (this.showCnvs) this.tableTitle += ' and ';
    }
    if (this.showCnvs) {
      this.tableTitle += `Copy-Number Variants Contain ${this.variant.chr}:${this.variant.pos}`;
    }
  }
  setData(data: DecipherDiseaseData[]) {
    data.map(D => {
      D['variant'] = `${D.hg19Chr}:${D.hg19Start}`;
      if (D.hg19Start !== D.hg19Stop) D['variant'] += `-${D.hg19Stop}`;
      if (D.ref && D.alt) D['variant'] += ` ${D.ref}>${D.alt}`;
      D['varType'] = D.cnvType === 1 ? 'CNV' : 'SNV';
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
          if (phenotype.ontology && phenotype.ontology.category) {
            counts[phenotype.ontology.category.name] = (counts[phenotype.ontology.category.name] || 0) + 1;
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
