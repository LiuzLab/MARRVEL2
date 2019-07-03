import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';


import { HumanGene } from './../../../../../interfaces/gene';

@Component({
  selector: 'app-protein-domain',
  templateUrl: './protein-domain.component.html',
  styleUrls: ['./protein-domain.component.scss']
})
export class ProteinDomainComponent implements OnInit, AfterViewInit {
  @Input() gene: HumanGene;
  @Input() data: DomainData[];

  @Output() highlight: EventEmitter< any > = new EventEmitter();

  dataSource: MatTableDataSource< DomainData > = new MatTableDataSource();
  displayedColumns = [ 'domainName', 'domainStart', 'domainStop', 'domainDescription', 'proteinId' ];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor() { }

  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.data);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  onDomainClick(from, to) {
    this.highlight.emit({
      from: (from && from.length && from[0] === '<') ? from.substr(1) : from,
      to: to
    });
  }
}

interface DomainData {
  index: string;
  domainName: string;
  domainStart: number;
  domainStop: number;
  domainDescription?: string;
  proteinId?: string;
  externalId?: string;
}