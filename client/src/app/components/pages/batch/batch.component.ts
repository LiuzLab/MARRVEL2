import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';
import { DomSanitizer } from '@angular/platform-browser';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/first';

import { Animations } from 'src/app/animations';
import { ApiService } from 'src/app/services/api.service';
import { DbNSFPData } from 'src/app/interfaces/data';
import { of } from 'rxjs';

@Component({
  selector: 'app-batch',
  templateUrl: './batch.component.html',
  styleUrls: ['./batch.component.scss'],
  animations: [ Animations.toggleInOut, Animations.fadeInOut ]
})
export class BatchComponent implements OnInit {
  variants;
  loading = false;

  hideUpBox = false;

  curPage = 0;
  vPerPage = 30;
  vFrom;
  vTo;

  dataSource: MatTableDataSource< VariantResult > = new MatTableDataSource();
  displayedColumns = [
    'variant',
    'gnomADAC', 'gnomADAN', 'gnomADAF', 'gnomADHom',
    'geno2mpHpo', 'geno2mpHom', 'geno2mpHet', 'geno2mpFuncAnno',
    'dgvVarLoss',
    'clinvarSig',
    'dbnsfpCadd', 'dbnsfpRevel', 'dbnsfpMcap', 'dbnsfpPHumDiv', 'dbnsfpPHumVar', 'dbnsfpGerp', 'dbnsfpPPV', 'dbnsfpPPM'
  ];

  tsvPageDownloadUrl = null;
  wholeLoading = false;
  wholeVarsHaveData = 0;
  wholeVarsPrepared = 0;
  tsvWholeDownloadUrl = null;

  constructor(
    private api: ApiService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
  }

  onPageChange(e: PageEvent) {
    this.vPerPage = e.pageSize;
    this.curPage = e.pageIndex;
    this.vFrom = this.vPerPage * this.curPage;
    this.updateSliceAndData(this.vFrom);
  }

  onVariantDataChange(e) {
    this.variants = e;

    this.tsvPageDownloadUrl = null;
    this.tsvWholeDownloadUrl = null;

    this.vFrom = 0;
    this.curPage = 0;
    this.updateSliceAndData(0);
    this.hideUpBox = true;
  }

  updateSliceAndData(vFrom) {
    this.vFrom = vFrom;
    this.vTo = Math.min(this.vFrom + this.vPerPage, this.variants.length);

    this.fetchData(this.vFrom, this.vTo);
  }

  fetchData(vFrom, vTo) {
    this.dataSource = new MatTableDataSource< VariantResult >();
    this.loading = true;
    this.tsvPageDownloadUrl = null;
    this.api.getBatchByArray(this.variants.slice(vFrom, vTo))
      .subscribe((res: VariantResult[]) => {
        for (const row of res) { this.processDataRow(row); }

        this.dataSource = new MatTableDataSource< VariantResult >(res);
        this.loading = false;
        this.tsvPageDownloadUrl = this.createDownloadUrl('.tsv');
      });
  }

  processDataRow(row: VariantResult) {
    if (row.gnomADVar) {
      row.gnomADVar.alleleCount = ((row.gnomADVar.genome || {}).alleleCount || 0) + ((row.gnomADVar.exome || {}).alleleCount || 0);
      row.gnomADVar.alleleNum = ((row.gnomADVar.genome || {}).alleleNum || 0) + ((row.gnomADVar.exome || {}).alleleNum || 0);
      row.gnomADVar.alleleFreq = row.gnomADVar.alleleCount / row.gnomADVar.alleleNum;
      row.gnomADVar.homCount = ((row.gnomADVar.genome || {}).homCount || 0) + ((row.gnomADVar.exome || {}).homCount || 0);
    }
    if (row.dgv) {
      row['dgvVarLoss'] = 0;
      for (const dgv of row.dgv) {
        row['dgvVarLoss'] += dgv.loss;
      }
    }
  }

  createDownloadUrl(fileType: string, whole?: boolean) {
    if (!whole) {
      return this.getBlobUrl(fileType, this.dataSource.data);
    } else {
      this.wholeLoading = true;
      this.tsvWholeDownloadUrl = null;

      const nPage = this.variants.length / this.vPerPage;   // Total number of pages with current 'varaint per page' setting
      const tasks: Observable< any >[] = [];
      for (let page = 0; page < nPage; ++page) {
        const vFrom = page * this.vPerPage;
        const vTo = Math.min(vFrom + this.vPerPage, this.variants.length);

        this.wholeVarsPrepared += vTo - vFrom;

        if (page === this.curPage && !this.loading) {    // not fetching data again for current page
          tasks.push(of(this.dataSource.data));
          this.wholeVarsHaveData += vTo - vFrom;
        } else {
          tasks.push(
            new Observable(observer => {
              this.api.getBatchByArray(this.variants.slice(vFrom, vTo))
                .subscribe(res => {
                  this.wholeVarsHaveData += vTo - vFrom;
                  observer.next(res);
                });
            }).first()
          );
        }
      }
      Observable.forkJoin(...tasks).subscribe(results => {
        this.tsvWholeDownloadUrl = this.getBlobUrl(fileType, results.flat());
        this.wholeLoading = false;
      });
    }
  }

  getBlobUrl(fileType, dataToDownload) {
    let dataString = '';
    let mediaType = '';
    switch (fileType) {
      case '.tsv':
        dataString = 'variant\tgnomAD_AC\tgnomAD_AN\tgnomAD_AF\tgnomAD_hom\t' +
                      'geno2mp_num_HPO\tgeno2mp_hom\tgeno2mp_het\tgeno2mp_anno\t' +
                      'dgv_loss\tclinvar_significance\tdbnsfp_cadd_phred\t' +
                      'dbnsfp_revel\tdbnsfp_mcap\tdbnsfp_polyphen2_humdiv\t' +
                      'dbnsfp_polyphen2_humvar\tdbnsfp_gerp\tdbnsfp_phylop_100way_vertebrate\t' +
                      'dbnsfp_phylop_30way_mammalian\n';
        for (const row of dataToDownload) {
          this.processDataRow(row);

          dataString = dataString +
            `${row.variant}\t` +
            `${row.gnomADVar ? row.gnomADVar.alleleCount : ''}\t` +
            `${row.gnomADVar ? row.gnomADVar.alleleNum : ''}\t` +
            `${row.gnomADVar ? row.gnomADVar.alleleFreq : ''}\t` +
            `${row.gnomADVar ? row.gnomADVar.homCount : ''}\t` +
            `${row.geno2mp ? row.geno2mp.hpoCount : ''}\t` +
            `${row.geno2mp ? row.geno2mp.homCount : ''}\t` +
            `${row.geno2mp ? row.geno2mp.hetCount : ''}\t` +
            `${row.geno2mp ? row.geno2mp.funcAnno : ''}\t` +
            `${row['dgvVarLoss']}\t` +
            `${row.clinvar ? row.clinvar.significance.description : ''}\t`
          ;
          if (row.dbnsfp && row.dbnsfp.scores) {
            dataString = dataString +
              `${row.dbnsfp.scores.CADD ? row.dbnsfp.scores.CADD.phred : ''}\t` +
              `${row.dbnsfp.scores.REVEL ? row.dbnsfp.scores.REVEL.score : ''}\t` +
              `${row.dbnsfp.scores.MCAP ? row.dbnsfp.scores.MCAP.prediction : ''}\t` +
              `${row.dbnsfp.scores.Polyphen2HDIV ? row.dbnsfp.scores.Polyphen2HDIV.prediction : ''}\t` +
              `${row.dbnsfp.scores.Polyphen2HVAR ? row.dbnsfp.scores.Polyphen2HVAR.prediction : ''}\t` +
              `${row.dbnsfp.scores['GERP++RS'] ? row.dbnsfp.scores['GERP++RS'].score : ''}\t` +
              `${row.dbnsfp.scores.phyloP100wayVertebrate ? row.dbnsfp.scores.phyloP100wayVertebrate.score : ''}\t` +
              `${row.dbnsfp.scores.phyloP30wayMammalian ? row.dbnsfp.scores.phyloP30wayMammalian.score : ''}`
            ;
          }
          else {
            dataString = dataString + '\t\t\t\t\t\t\t';
          }
          dataString = dataString + '\n';
        }
        mediaType = 'text/tab-separated-values';
        break;
    }
    const blob = new Blob([ dataString ], { type: mediaType });
    return this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
  }
}

interface VariantResult {
  variant: string;
  gnomADVar?: {
    genome?: {
      alleleCount?: number;
      alleleNum?: number;
      homCount?: number;
    };
    exome?: {
      alleleCount?: number;
      alleleNum?: number;
      homCount?: number;
    };
    alleleCount?: number;
    alleleNum?: number;
    homCount?: number;
    alleleFreq?: number;
  };
  geno2mp?: {
    hpoCount: number;
    homCount: number;
    funcAnno: string;
    hetCount: number;
  };
  dgv?: [{
    frequency?: number;
    gain: number;
    loss: number;
    sampleSize: number;
  }];
  clinvar?: {
    uid: number;
    title: string;
    significance: {
      description: string;
      reviewStatus: string;
      lastEvaluated: string;
    };
    condition?: string;
  };
  dbnsfp?: DbNSFPData;
}

