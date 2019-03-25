import { Component, OnInit, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { MatSort, MatTableDataSource, MatPaginator } from '@angular/material';

export interface GenePhenotypeRel {
  phenotype: string;
  phenotypeMimNumber: number;
  phenotypeInheritance: string | null;
}

@Component({
  selector: 'app-omim-phenotypes',
  templateUrl: './omim-phenotypes.component.html',
  styleUrls: ['./omim-phenotypes.component.scss']
})
export class OmimPhenotypesComponent implements OnInit, OnChanges {
  @Input() data: GenePhenotypeRel[] | null;
  displayedColumns: string[] = ['phenotype', 'phenotypeMimNumber', 'phenotypeInheritance'];
  dataSource: MatTableDataSource<GenePhenotypeRel> = new MatTableDataSource();

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
  }
}
