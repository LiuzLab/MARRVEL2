import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

import { Animations } from 'src/app/animations';
import { ApiService } from 'src/app/services/api.service';
import { DbNSFPData } from 'src/app/interfaces/data';

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
    this.vFrom = 0;
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
        for (const row of res) {
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
        this.dataSource = new MatTableDataSource< VariantResult >(res);
        this.loading = false;
        this.tsvPageDownloadUrl = this.createDownloadUrl('.tsv');
      });
  }

  createDownloadUrl(fileType: string, whole?: boolean) {
    let dataToDownload: VariantResult[] = [];
    if (!whole) {
      dataToDownload = this.dataSource.data;
    }

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
