import { Component, Input, OnChanges, ViewChild, AfterViewInit } from '@angular/core';
import { MatSort, MatTableDataSource, MatPaginator, MatSlideToggleChange } from '@angular/material';

import { Animations } from '../../../../../animations';

import { HPO_BROAD_TO_CAT } from './../../../../../category';

@Component({
  selector: 'app-geno2mp-variant-table',
  templateUrl: './geno2mp-variant-table.component.html',
  styleUrls: ['./geno2mp-variant-table.component.scss'],
  animations: [
    Animations.slideIn
  ]
})
export class Geno2mpVariantTableComponent implements OnChanges, AfterViewInit {
  @Input() data: any[] | null;
  phenotypes: object = {};

  affectedProfiles = 0;

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
    this.dataSource.filter = JSON.stringify(this.filtersToApply);
  }

  ngOnChanges() {
    this.dataSource = new MatTableDataSource(this.data);
    for (const profile of this.data) {
      if (profile.affectedStatus === 'affected') {
        this.affectedProfiles += 1;
      }
    }
    this.countPhenotypes();

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
    this.countPhenotypes();
    this.dataSource.filter = JSON.stringify(this.filtersToApply);
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  filter(colName: string, filterValue: string) {
    this.filtersToApply[colName] = filterValue;
    this.dataSource.filter = JSON.stringify(this.filtersToApply);
  }

  countPhenotypes() {
    const phenotypes = {};
    for (const hpoProfile of this.data) {
      if (this.showOnlyAffected && hpoProfile.affectedStatus !== 'affected') continue;

      for (const hpoId of hpoProfile.broad.hpoIds) {
        const catName = HPO_BROAD_TO_CAT[hpoId];
        phenotypes[catName] = (phenotypes[catName] || 0) + 1;
      }
    }
    this.phenotypes = phenotypes;
  }
}
