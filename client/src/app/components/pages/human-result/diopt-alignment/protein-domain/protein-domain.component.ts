import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';



@Component({
  selector: 'app-protein-domain',
  templateUrl: './protein-domain.component.html',
  styleUrls: ['./protein-domain.component.scss']
})
export class ProteinDomainComponent implements OnInit, AfterViewInit {
  @Input() data: DomainData[];

  @Output() highlight: EventEmitter< any > = new EventEmitter();

  dataSource: MatTableDataSource< DomainData > = new MatTableDataSource();
  displayedColumns = [ 'domainName', 'domainStart', 'domainStop', 'domainDescription', 'proteinId' ];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor() { }

  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.data);
  }
  ngAfterViewInit() {
    this.initTableAcc();
  }

  initTableAcc() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sortData = (data: DomainData[], sort: MatSort) => {
      return data.sort((a: DomainData, b: DomainData) => {
        const dirMul = sort.direction === 'asc' ?  1 : -1;
        switch (sort.active) {
          case 'domainStart':
            const aStart = isNaN(+a.domainStart) ? +a.domainStart.substr(1) : +a.domainStart;
            const bStart = isNaN(+b.domainStart) ? +b.domainStart.substr(1) : +b.domainStart;
            return (aStart < bStart ? -1 : 1) * dirMul;
          case 'domainStop':
            const aStop = isNaN(+a.domainStop) ? +a.domainStop.substr(1) : +a.domainStop;
            const bStop = isNaN(+b.domainStop) ? +b.domainStop.substr(1) : +b.domainStop;
            return (aStop < bStop ? -1 : 1) * dirMul;
          default:
            return (a[sort.active] < b[sort.active] ? -1 : 1) * dirMul;
        }
      });
    };
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
  domainStart: string;
  domainStop: string;
  domainDescription?: string;
  proteinId?: string;
  externalId?: string;
}
