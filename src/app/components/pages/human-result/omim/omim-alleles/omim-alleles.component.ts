import { Component, OnInit, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { MatSort, MatTableDataSource, MatPaginator } from '@angular/material';

export interface AllelicVariant {
  name: string;
  dbSnps: string;
  mutations: string;
}


@Component({
  selector: 'app-omim-alleles',
  templateUrl: './omim-alleles.component.html',
  styleUrls: ['./omim-alleles.component.scss']
})
export class OmimAllelesComponent implements OnInit, OnChanges {
  @Input() data: AllelicVariant[] | null;
  displayedColumns: string[] = ['name', 'mutations', 'dbSnps'];
  dataSource: MatTableDataSource<AllelicVariant> = new MatTableDataSource();

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
