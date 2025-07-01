import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ProteinDomainPlot } from '../../../../d3/protein-domain-plot';
import { SmartDomain } from '../../../../interfaces/data';
import { HumanGene } from '../../../../interfaces/gene';
import { ApiService } from '../../../../services/api.service';

@Component({
  selector: 'app-smart-protein-domain',
  templateUrl: './smart-protein-domain.component.html',
  styleUrls: ['./smart-protein-domain.component.scss']
})
export class SmartProteinDomainComponent implements OnInit, AfterViewInit {
  @Input() gene!: HumanGene;

  loading = true;
  data: SmartDomain[] | null;

  dataSource: MatTableDataSource< SmartDomain > = new MatTableDataSource();
  displayedColumns = [ 'name', 'start', 'end', 'eValue' ];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  plot: ProteinDomainPlot;
  @ViewChild('domainPlotContainer', { static: false }) domainPlotContainer: ElementRef;
  zoomRatio = 1;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.apiService.getSmartDomain(this.gene)
      .subscribe({
        next: (res: SmartDomain[]) => {
          this.data = res.filter((e) => e.type !== 'INTRON');
          this.initTable(this.data);
          this.loading = false;
          this.plot = new ProteinDomainPlot('smart-domain', this.data, {
            width: this.domainPlotContainer.nativeElement.offsetWidth
          });
        },
        error: (err) => {
          console.log(err);
          this.data = null;
          this.loading = false;
        }
      });
  }

  ngAfterViewInit(): void {
    this.initTable();
  }

  initTable(data?: SmartDomain[]): void {
    if (data) {
      this.dataSource = new MatTableDataSource(this.data);
    }
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  zoom(dr) {
    this.zoomRatio = Math.max(0.2, this.zoomRatio + dr);
    this.plot.xScale(this.zoomRatio);
  }
}

