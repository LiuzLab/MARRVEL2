import { Component, OnChanges, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource } from '@angular/material';

import { HumanGene } from './../../../../../interfaces/gene';

@Component({
  selector: 'app-protein-domain',
  templateUrl: './protein-domain.component.html',
  styleUrls: ['./protein-domain.component.scss']
})
export class ProteinDomainComponent implements OnChanges {
  @Input() loading: boolean;
  @Input() gene: HumanGene;
  @Input() data: DomainData[];

  @Output() highlight: EventEmitter< any > = new EventEmitter();

  dataSource: MatTableDataSource< DomainData > = new MatTableDataSource();
  displayedColumns = [ 'index', 'domainName', 'domainStart', 'domainStop', 'domainDescription', 'proteinId', 'externalId' ];

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.data && changes.data.currentValue) {
      this.dataSource = new MatTableDataSource(this.data);
    }
  }

  onDomainClick(from, to) {
    this.highlight.emit({
      from: from,
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