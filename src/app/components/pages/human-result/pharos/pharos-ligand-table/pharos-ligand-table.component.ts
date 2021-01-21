import { Component, OnInit, Input, ViewChild, AfterViewInit, OnChanges } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-pharos-ligand-table',
  templateUrl: './pharos-ligand-table.component.html',
  styleUrls: ['./pharos-ligand-table.component.scss']
})
export class PharosLigandTableComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() ligands;

  displayedColumns: string[] = [ 'name', 'structure', 'targetProperties', 'extLink' ];
  dataSource = new MatTableDataSource< any >();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  idgDevLevTrans = {
    'Tdark': 'Little is known about this target',
    'Tbio': 'No known drugs for this target',
    'Tchem': 'Target has at least one CHEMBL compound',
    'Tclin': 'Target has at least one approved drug'
  };

  constructor() { }

  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.ligands);
    this.dataSource.paginator = this.paginator;
  }

  ngOnChanges() {
    this.dataSource.paginator = this.paginator;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  encodeForUrl(str: string) {
    return encodeURIComponent(str);
  }
}
