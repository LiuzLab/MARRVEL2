import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, PageEvent } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { take } from 'rxjs/operators';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/first';

import { Animations } from 'src/app/animations';
import { ApiService } from 'src/app/services/api.service';

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
    'g2mpHom', 'g2mpHet',
    'gnomadSynZ', 'gnomadMisZ', 'gnomadLofZ',
    'dgvGain', 'dgvLoss'
  ];
  tsvPageDownloadUrl = null;
  tsvWholeDownloadUrl = null;
  wholeLoading = false;
  wholeGenesHaveData = 0;
  wholeGenesPrepared = 0;

  constructor(private api: ApiService) { }

  ngOnInit() {
  }

  search(e) {
    this.genes = e;
    this.loading = true;
    this.api.getGeneBatchByArray(this.genes)
      .pipe(take(1))
      .subscribe(res => {
        this.data = res;
        this.loading = false;
      }, err => {
        this.data = null;
        this.loading = false;
      });
  }

  fetchData(from, to) {
    this.dataSource = new MatTableDataSource< any >();
    this.loading = true;
    this.tsvPageDownloadUrl = null;
    this.api.getGeneBatchByArray(this.genes.slice(from, to))
      .pipe(take(1))
      .subscribe(res => {
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
    }
    else {
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
        }
        else {
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
    /*
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
    */
  }

}
