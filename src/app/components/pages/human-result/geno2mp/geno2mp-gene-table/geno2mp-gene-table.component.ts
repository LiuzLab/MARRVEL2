import { Component, Input, OnChanges, ViewChild, AfterViewInit, SimpleChanges } from '@angular/core';
import { MatSort, MatTableDataSource, MatPaginator } from '@angular/material';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

import { Geno2MPResult } from '../../../../../interfaces/data';

@Component({
  selector: 'app-geno2mp-gene-table',
  templateUrl: './geno2mp-gene-table.component.html',
  styleUrls: ['./geno2mp-gene-table.component.scss']
})
export class Geno2mpGeneTableComponent implements OnChanges, AfterViewInit {
  @Input() data: any[] | null;

  displayedColumns = [ 'hg19Chr', 'hg19Pos', 'ref', 'alt', 'nHpoProfiles', 'homCount', 'hetCount', 'funcAnno' ];
  dataSource: MatTableDataSource<Geno2MPResult> = new MatTableDataSource();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('geno2mpGenePaginator') paginator: MatPaginator;

  categoryNames = [
    'Non-Coding',
    'Synonymouse/Unknown',
    'Missense/Ohter Indel',
    'Splice/Frameshift/Nonsense/Stop Loss',
  ];
  categoriesVisible = [ false, false, false, true ];
  hpoProfiles: number;

  constructor() { }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.data && changes.data.currentValue) {
      this.sumHpos();
      this.initDataTable();
    }
  }

  sumHpos() {
    this.hpoProfiles = 0;
    for (const e of this.data) {
      if (this.categoriesVisible[e.categoryNum]) {
        this.hpoProfiles += e.nHpoProfiles;
      }
    }
  }

  initDataTable() {
    this.dataSource = new MatTableDataSource(this.data);
    this.initFilters();
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  initFilters() {
    this.dataSource.filterPredicate = (data, filter) => {
      return (this.categoriesVisible[data['categoryNum']]);
    };
    this.dataSource.filter = ' ';
  }

  onCategoryChange(idx, e: MatSlideToggleChange) {
    this.categoriesVisible[idx] = e.checked;
    this.dataSource.filter = ' ';
    this.sumHpos();
  }

}
