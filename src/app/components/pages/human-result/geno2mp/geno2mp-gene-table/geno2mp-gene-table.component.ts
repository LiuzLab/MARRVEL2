import { Component, OnInit, Input, OnChanges, ViewChild, AfterViewInit, SimpleChanges } from '@angular/core';
import { MatSort, MatTableDataSource, MatPaginator } from '@angular/material';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-geno2mp-gene-table',
  templateUrl: './geno2mp-gene-table.component.html',
  styleUrls: ['./geno2mp-gene-table.component.scss']
})
export class Geno2mpGeneTableComponent implements OnChanges, AfterViewInit {
  @Input() data: any[] | null;

  displayedColumns = [ 'hg19Chr', 'hg19Pos', 'ref', 'alt', 'funcAnno', 'nHpoProfiles', 'homCount', 'hetCount' ];
  columnNames = [ 'Chr', 'Position', 'Ref', 'Alt', 'Annotations', '# HPO Profiles', '# Hom', '# Het'];
  dataSource: MatTableDataSource<Geno2MPResult> = new MatTableDataSource();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('geno2mpGenePaginator') paginator: MatPaginator;

  categoryNames = [
    'Non-Coding',
    'Synonymouse/Unknown',
    'Missense/Ohter Indel',
    'Splice/Frameshift/Nonsense/Stop Loss',
  ];
  categoriesVisible = [ false, false, false, true ];

  constructor() { }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.data && changes.data.currentValue) {
      this.initDataTable();
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
      return (this.categoriesVisible[data.categoryNum]);
    };
    this.dataSource.filter = ' ';
  }

  onCategoryChange(idx, e: MatSlideToggleChange) {
    this.categoriesVisible[idx] = e.checked;
    this.dataSource.filter = ' ';
  }

}

interface Geno2MPResult {
  hg19Chr: string;
  hg19Pos: number;
  ref: string;
  alt: string;
  genes: [{
    entrezId: number;
    symbol: string;
  }];
  homCount: number;
  hetCount: number;
  hpoCount: number;
  hpoProfiles: [{
    narrow: {
      hpoId: string;
      hpoTerm: string;
    },
    medium: {
      hpoId: string;
      hpoTerm: string;
    },
    broad: {
      hpoId: string;
      hpoTerm: string;
    },
    affectedStatus: string;
  }];
  funcAnno: string;
  categoryNum: number;
  category: string;
}
