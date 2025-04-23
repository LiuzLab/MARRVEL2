import { Component, Input, OnChanges, ViewChild, AfterViewInit, SimpleChanges } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { Geno2MPResult } from '../../../../../interfaces/data';

@Component({
  selector: 'app-geno2mp-gene-table',
  templateUrl: './geno2mp-gene-table.component.html',
  styleUrls: ['./geno2mp-gene-table.component.scss']
})
export class Geno2mpGeneTableComponent implements OnChanges, AfterViewInit {
  @Input() data: any[] | null;
  @Input() showNonCoding = false;
  @Input() showSynonymous = false;
  @Input() showMissense = false;
  @Input() showNonsense = true;

  displayedColumns = [ 'hg19Chr', 'hg19Pos', 'ref', 'alt', 'nHpoProfiles', 'homCount', 'hetCount', 'funcAnno' ];
  dataSource: MatTableDataSource<Geno2MPResult> = new MatTableDataSource();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('geno2mpGenePaginator') paginator: MatPaginator;

  hpoProfiles: number;
  categoriesVisible = {
    'Non-Coding': false,
    'Synonymous/Unknown': false,
    'Missense/Other Indel': false,
    'Splice/Frameshift/Nonsense/Stop Loss': true
  };

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

    if (changes.showNonCoding) {
      this.categoriesVisible['Non-Coding'] = this.showNonCoding;

      this.sumHpos();
      this.dataSource.filter = ' ';
    }
    if (changes.showSynonymous) {
      this.categoriesVisible['Synonymous/Unknown'] = this.showSynonymous;

      this.sumHpos();
      this.dataSource.filter = ' ';
    }
    if (changes.showMissense) {
      this.categoriesVisible['Missense/Other Indel'] = changes.showMissense.currentValue;

      this.sumHpos();
      this.dataSource.filter = ' ';
    }
    if (changes.showNonsense) {
      this.categoriesVisible['Splice/Frameshift/Nonsense/Stop Loss'] = this.showNonsense;

      this.sumHpos();
      this.dataSource.filter = ' ';
    }
  }

  sumHpos() {
    this.hpoProfiles = 0;
    for (const e of this.data) {
      if (this.categoriesVisible[e.category]) {
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
      return (this.categoriesVisible[data['category']]);
    };
    this.dataSource.filter = ' ';
  }
}
