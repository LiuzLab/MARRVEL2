import { Component, OnInit, Input, ViewChild, OnChanges } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { HumanGene } from '../../../../../interfaces/gene';
import { Variant } from '../../../../../interfaces/variant';
import { ClinVarVarinat } from '../../../../../interfaces/data';

@Component({
  selector: 'app-clinvar-variants-table',
  templateUrl: './clinvar-variants-table.component.html',
  styleUrls: ['./clinvar-variants-table.component.scss']
})
export class ClinvarVariantsTableComponent implements OnInit, OnChanges {
  @Input() gene: HumanGene;
  @Input() variant: Variant;
  @Input() data: ClinVarVarinat[];

  showSearch = false;
  showMatchingVarsFirst = true;
  displayedColumns: string[] = [ 'title', 'location', 'condition', 'significance', 'reviewStatus' ];
  dataSource: MatTableDataSource< ClinVarVarinat > = new MatTableDataSource();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor() { }

  ngOnInit() {
    this.initTable();
  }

  ngOnChanges() {
    this.initTable();
  }

  initTable() {
    this.dataSource = new MatTableDataSource(this.data);
    this.dataSource.sort = this.sort;
    this.dataSource.sortData = (data, sort: MatSort) => {
      return data.sort((a, b) => {
        const aMatching = this.variant && a.start <= this.variant.pos && this.variant.pos <= a.stop;
        const bMatching = this.variant && b.start <= this.variant.pos && this.variant.pos <= b.stop;
        if (this.variant && this.showMatchingVarsFirst && aMatching !== bMatching) {
          return aMatching ? -1 : 1;
        }
        const dirMul = sort.direction === 'asc' ? 1 : -1;
        switch (sort.active) {
          case 'variation':
            return a.title < b.title ? -1 * dirMul : (a.title > b.title ? 1 * dirMul : 0);
          case 'location':
            return a.start < b.start || (a.start === b.start && a.stop < b.stop) ? -1 * dirMul : 1 * dirMul;
          case 'condition':
            return a.condition < b.condition ? -1 * dirMul : (a.condition > b.condition ? 1 * dirMul : 0);
          case 'significance':
            const aDesc = (a.significance || { description: ''}).description;
            const bDesc = (b.significance || { description: ''}).description;
            return aDesc < bDesc ? -1 * dirMul : (aDesc > bDesc ? 1 * dirMul : 0);
        }
        return 1;
      });
    };
    this.dataSource.paginator = this.paginator;
  }

  onSearchChange(e) {
    this.dataSource.filter = e.target.value;
  }
}
