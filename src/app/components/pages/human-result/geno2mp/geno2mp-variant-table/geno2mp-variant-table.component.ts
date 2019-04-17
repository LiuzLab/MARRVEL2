import { Component, OnInit, Input, OnChanges, ViewChild, AfterViewInit } from '@angular/core';
import { MatSort, MatTableDataSource, MatPaginator, MatSlideToggleChange } from '@angular/material';

import { Animations } from '../../../../../animations';


@Component({
  selector: 'app-geno2mp-variant-table',
  templateUrl: './geno2mp-variant-table.component.html',
  styleUrls: ['./geno2mp-variant-table.component.scss'],
  animations: [
    Animations.slideIn
  ]
})
export class Geno2mpVariantTableComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() data: any[] | null;
  @Input() title: string;

  displayedColumns = ['affectedStatus', 'broadTerm', 'mediumTerm', 'narrowTerm'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();

  filtersColumns: string[] = [];
  showFilters = false;
  filtersToApply = {};

  showOnlyAffected = true;

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
      if (this.showOnlyAffected && data.affectedStatus !== 'affected') {
        return false;
      }

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

  onCategoryChange(e: MatSlideToggleChange) {
    this.showOnlyAffected = e.checked;
    this.dataSource.filter = JSON.stringify(this.filtersToApply);
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  filter(colName: string, filterValue: string) {
    this.filtersToApply[colName] = filterValue;
    this.dataSource.filter = JSON.stringify(this.filtersToApply);
  }
}
