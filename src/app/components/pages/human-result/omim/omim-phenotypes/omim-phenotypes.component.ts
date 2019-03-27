import { Component, OnInit, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { MatSort, MatTableDataSource, MatPaginator } from '@angular/material';

import { Animations } from '../../../../../animations';

export interface GenePhenotypeRel {
  phenotype: string;
  phenotypeMimNumber: number;
  phenotypeInheritance: string | null;
}

@Component({
  selector: 'app-omim-phenotypes',
  templateUrl: './omim-phenotypes.component.html',
  styleUrls: ['./omim-phenotypes.component.scss'],
  animations: [
    Animations.slideIn
  ]
})
export class OmimPhenotypesComponent implements OnInit, OnChanges {
  @Input() symbol: string;
  @Input() data: GenePhenotypeRel[] | null;

  displayedColumns: string[] = ['phenotype', 'phenotypeMimNumber', 'phenotypeInheritance'];
  dataSource: MatTableDataSource<GenePhenotypeRel> = new MatTableDataSource();

  filtersColumns: string[] = ['phenotypeFilter', 'phenotypeMimNumberFilter', 'phenotypeInheritanceFilter'];
  showFilters = false;
  filtersToApply = {};

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    this.dataSource = new MatTableDataSource(this.data);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.filterPredicate = (data, filter) => {
      const filters = JSON.parse(filter);
      let isMatched = true;
      for (let colName in filters) {
        if (!(colName in filters) || filters[colName] === '') continue;

        const value = ('' + data[colName] || '').toLowerCase();
        const filterValue = (filters[colName] || '').toLowerCase();

        if (value.indexOf(filterValue) === -1) {
          isMatched = false;
          break;
        }
      }
      return isMatched;
    };
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  filter(colName: string, filterValue: string) {
    this.filtersToApply[colName] = filterValue;
    this.dataSource.filter = JSON.stringify(this.filtersToApply);
  }
}
