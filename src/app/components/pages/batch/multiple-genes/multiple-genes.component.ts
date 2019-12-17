import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, PageEvent } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { take } from 'rxjs/operators';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/first';

import { Animations } from 'src/app/animations';
import { ApiService } from 'src/app/services/api.service';

import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-multiple-genes',
  templateUrl: './multiple-genes.component.html',
  styleUrls: ['./multiple-genes.component.scss'],
  animations: [ Animations.toggleInOut ]
})
export class MultipleGenesComponent implements OnInit {
  genes;
  loading = false;
  data;

  hideUpBox = false;

  curPage = 0;
  gPerPage = 30;
  gFrom;
  gTo;
  dataSource: MatTableDataSource< any > = new MatTableDataSource();
  displayedColumns = [
    'symbol',
    'omimPhenotypes', 'omimAllele',
    'clinvarP', 'clinvarLP', 'clinvarLB', 'clinvarB',
    'g2mpHom', 'g2mpHet', 'g2mpHpo',
    'gnomadSynZ', 'gnomadMisZ', 'gnomadLofZ',
    'dgvGain', 'dgvLoss'
  ];
  tsvPageDownloadUrl = null;
  tsvWholeDownloadUrl = null;
  wholeLoading = false;
  wholeGenesHaveData = 0;
  wholeGenesPrepared = 0;

  selectedInputType  = 'multigenes';

  constructor(
    private api: ApiService,
    private sanitizer: DomSanitizer,
    private router: Router
  ) { }

  ngOnInit() { }

  search(e) {
    this.hideUpBox = true;
    this.genes = e;
    this.fetchData(this.gFrom, this.gTo);
  }

  fetchData(from, to) {
    this.dataSource = new MatTableDataSource< any >();
    this.loading = true;
    this.tsvPageDownloadUrl = null;
    this.api.getGeneBatchByArray(this.genes.slice(from, to))
      .pipe(take(1))
      .subscribe(res => {
        console.log(res);
        this.data = res;
        this.dataSource = new MatTableDataSource< any >(res);
        this.loading = false;
        this.tsvPageDownloadUrl = this.createDownloadUrl('.tsv');
      }, err => {
        this.data = null;
        this.loading = false;
      });
  }

  onPageChange(e: PageEvent) {
    this.gPerPage = e.pageSize;
    this.curPage = e.pageIndex;
    this.gFrom = this.gPerPage * this.curPage;
    this.gTo = Math.min(this.genes.length, this.gFrom + this.gPerPage);
    this.fetchData(this.gFrom, this.gTo);
  }

  createDownloadUrl(fileType: string, whole?: boolean) {
    if (!whole) {
      return this.getBlobUrl(fileType, this.dataSource.data);
    } else {
      let dataToDownload: object[] = [];

      this.wholeLoading = true;
      this.tsvWholeDownloadUrl = null;

      const nPage = this.genes.length / this.gPerPage;   // Total number of pages with current 'varaint per page' setting
      const tasks: Observable< any >[] = [];
      for (let page = 0; page < nPage; ++page) {
        const gFrom = page * this.gPerPage;
        const gTo = Math.min(gFrom + this.gPerPage, this.genes.length);

        this.wholeGenesPrepared += gTo - gFrom;

        if (page === this.curPage && !this.loading) {    // not fetching data again for current page
          dataToDownload = dataToDownload.concat(this.dataSource.data);
          this.wholeGenesHaveData += gTo - gFrom;
        } else {
          tasks.push(
            new Observable(observer => {
              this.api.getBatchByArray(this.genes.slice(gFrom, gTo))
                .subscribe(res => {
                  this.wholeGenesHaveData += gTo - gFrom;
                  observer.next(res);
                });
            }).first()
          );
        }
      }
      Observable.forkJoin(...tasks).subscribe(results => {
        for (const res of results) {
          dataToDownload = dataToDownload.concat(res);
        }
        this.tsvWholeDownloadUrl = this.getBlobUrl(fileType, dataToDownload);
        this.wholeLoading = false;
      });
    }
  }

  getBlobUrl(fileType, dataToDownload) {
    let dataString = '';
    let mediaType = '';
    switch (fileType) {
      case '.tsv':
        dataString = 'symbol\tomim_phenotype\tomim_allele\t' +
          'clinvar_pathogenic\tclinvar_likely_pathogenic\t' +
          'clinvar_likely_benign\tclinvar_benign\t' +
          'geno2mp_hom\tgeno2mp_het\tgeno2mp_hpo\t' +
          'gnomad_syn_z\tgnomad_mis_z\tgnomad_lof_z\t' +
          'dgv_gain\tdgv_oss\n';
        for (const row of dataToDownload) {
          dataString = dataString +
            `${row.symbol}\t` +
            `${row.omim ? (row.omim.numPhenos || 0) : ''}\t` +
            `${row.omim ? (row.omim.numVars || 0) : ''}\t` +
            `${row.clinvar ? (row.clinvar.pathogenic || 0) : ''}\t` +
            `${row.clinvar ? (row.clinvar.likelyPathogenic || 0) : ''}\t` +
            `${row.clinvar ? (row.clinvar.likelyBenign || 0) : ''}\t` +
            `${row.clinvar ? (row.clinvar.benign || 0) : ''}\t` +
            `${row.geno2mp ? (row.geno2mp.homCounts || 0) : ''}\t` +
            `${row.geno2mp ? (row.geno2mp.hetCounts || 0) : ''}\t` +
            `${row.geno2mp ? (row.geno2mp.hpoCounts || 0) : ''}\t` +
            `${row.gnomad && row.gnomad.syn ? row.gnomad.syn.z : ''}\t` +
            `${row.gnomad && row.gnomad.mis ? row.gnomad.mis.z : ''}\t` +
            `${row.gnomad && row.gnomad.lof ? row.gnomad.lof.pLI : ''}\t` +
            `${row.dgv ? (row.dgv.gains || 0) : ''}\t` +
            `${row.dgv ? (row.dgv.losses || 0) : ''}\n`;
        }
        mediaType = 'text/tab-separated-values';
        break;
    }
    const blob = new Blob([ dataString ], { type: mediaType });
    return this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
  }

  onInputTypeChange(e) {
    if (this.selectedInputType === 'gene') {
      this.router.navigate(['']);
    } else if (this.selectedInputType === 'protein') {
      this.router.navigate(['human', 'protein' ]);
    } else if (this.selectedInputType === 'modelgene') {
      this.router.navigate(['model', 'gene' ]);
    } else if (this.selectedInputType === 'vcf') {
      this.router.navigate(['human', 'batch', 'vcf' ]);
    }
  }
}
