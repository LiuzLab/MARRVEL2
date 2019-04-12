import { Component, OnInit, Input, OnChanges, ViewChild, AfterViewInit } from '@angular/core';
import { MatSort, MatTableDataSource, MatPaginator } from '@angular/material';

import { Animations } from '../../animations';

@Component({
  selector: 'app-basic-datatable',
  templateUrl: './basic-datatable.component.html',
  styleUrls: ['./basic-datatable.component.scss'],
  animations: [
    Animations.slideIn
  ]
})
export class BasicDatatableComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() data: any[] | null;
  @Input() title: string;
  @Input() unit: string;

  @Input() sortActive: string;
  @Input() sortDirection = 'asc';
  @Input() displayedColumns: string[];
  @Input() columnNames: string[];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();

  filtersColumns: string[] = [];
  showFilters = false;
  filtersToApply = {};

  @Input() url: boolean[];
  @Input() urlPrefixes: string[] = [];
  @Input() urlPostfixes: string[] = [];

  @Input() types: boolean[];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor() { }

  initFilters() {
    this.filtersToApply = {};
    this.filtersColumns = [];
    for (const colName of this.displayedColumns) {
      this.filtersColumns.push(colName + 'Filter');
    }
    this.dataSource.filterPredicate = (data, filter) => {
      const filters = JSON.parse(filter);
      let isMatched = true;
      for (const fColName in filters) {
        if (!(fColName in filters) || filters[fColName] === '') continue;

        const value = ('' + data[fColName] || '').toLowerCase();
        const filterValue = (filters[fColName] || '').toLowerCase();

        if (value.indexOf(filterValue) === -1) {
          isMatched = false;
          break;
        }
      }
      return isMatched;
    };
  }

  ngOnInit() {
  }

  ngOnChanges() {
    this.dataSource = new MatTableDataSource(this.data);
    this.initFilters();
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  filter(colName: string, filterValue: string) {
    this.filtersToApply[colName] = filterValue;
    this.dataSource.filter = JSON.stringify(this.filtersToApply);
  }

  toFixed(num: number) {
    return (typeof num) === 'number' ? num.toFixed(6) : null;
  }

}
