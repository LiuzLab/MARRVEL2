import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../services/api.service';

import { HumanGene } from '../../../interfaces/gene';
import { Variant } from '../../../interfaces/variant';

import { VariantService } from '../../../services/variant.service';

@Component({
  selector: 'app-human-result',
  templateUrl: './human-result.component.html',
  styleUrls: ['./human-result.component.scss']
})
export class HumanResultComponent implements OnInit {
  pageLoading = true;
  sidenavOpened = false;

  // Input
  geneEntrezId: number | null;
  variantInput: string | null;
  proteinInput: string | null;

  // Processed input
  gene: HumanGene | null = null;
  variant: Variant | null = null;
  variantString: string;

  // Data from server
  omimLoading = true;
  omim: object | null;
  clinVarLoading = true;
  clinVar: object[] | null;
  gnomADLoading = true;
  gnomAD: object | null;
  gnomADGeneLoading = true;
  gnomADGene: object | null;
  dbNSFPLoading = true;
  dbNSFP: object | null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    private variantService: VariantService
  ) { }

  requestGeneData() {
    if (this.gene.xref.omimId) {
      this.omimLoading = true;
      this.api.getOMIMByMimNumber(this.gene.xref.omimId)
        .subscribe((res) => {
          this.omimLoading = false;
          this.omim = res;
        });
    }
    else {
      this.omimLoading = false;
      this.omim = null;
    }

    this.clinVarLoading = true;
    this.api.getClinVarByEntrezId(this.gene.entrezId)
      .subscribe((res) => {
        this.clinVar = res;
        this.clinVarLoading = false;
      });

    this.gnomADGeneLoading = true;
    this.api.getGnomADGeneByEntrezId(this.gene.entrezId)
      .subscribe((res) => {
        this.gnomADGene = res;
        this.gnomADGeneLoading = false;
      });
  }

  requestVariantData() {
    this.gnomADLoading = true;
    this.api.getGnomADVaraint(this.variant)
      .subscribe((res) => {
        this.gnomAD = res;
        this.gnomADLoading = false;
      });

    this.dbNSFPLoading = true;
    this.api.getDbNSFP(this.variant)
      .subscribe((res) => {
        if (res && res.scores) {
          if (res.scores.MCAP.prediction === 'T') {
            res.scores.MCAP.prediction = 'Tolerated';
          }
          else if (res.scores.MCAP.prediction === 'D') {
            res.scores.MCAP.prediction = 'Damaging';
          }

          if (res.scores.Polyphen2HDIV.prediction === 'B') {
            res.scores.Polyphen2HDIV.prediction = 'Benign';
          }
          else if (res.scores.Polyphen2HDIV.prediction === 'P') {
            res.scores.Polyphen2HDIV.prediction = 'Possibly Damaging';
          }
          else if (res.scores.Polyphen2HDIV.prediction === 'D') {
            res.scores.Polyphen2HDIV.prediction = 'Probably Damaging';
          }

          if (res.scores.Polyphen2HVAR.prediction === 'B') {
            res.scores.Polyphen2HVAR.prediction = 'Benign';
          }
          else if (res.scores.Polyphen2HVAR.prediction === 'P') {
            res.scores.Polyphen2HVAR.prediction = 'Possibly Damaging';
          }
          else if (res.scores.Polyphen2HVAR.prediction === 'D') {
            res.scores.Polyphen2HVAR.prediction = 'Probably Damaging';
          }
        }

        this.dbNSFP = res;
        this.dbNSFPLoading = false;
      });
  }

  ngOnInit() {
    this.route.params.subscribe((param) => {
      this.geneEntrezId = param.gene ? +param.gene : null;
      this.variantInput = param.variant || null;
      this.proteinInput = param.protein || null;

      if (this.geneEntrezId !== null) {
        this.api.getGeneByEntrezId(this.geneEntrezId)
          .subscribe((res) => {
            this.gene = res;

            this.requestGeneData();
          });
      }

      if (this.variantInput !== null && this.variantInput !== '') {
        const parsed = this.variantService.parse(this.variantInput);
        if (!parsed.valid) {
          // TODO: error
        }
        else if (parsed.type === 'hgvs') {
          // TODO: Request hgvs --> coordinate
        }
        else if (parsed.type === 'coord') {
          this.variant = parsed.variant;
          this.variantString = `Chr${this.variant.chr}:${this.variant.pos} ${this.variant.ref}>${this.variant.alt}`;
          this.requestVariantData();
        }
        else {
          // TODO: error
        }
      }
    });
  }

  toggleSidenav(e) {
    this.sidenavOpened = e.sidenavOpened;
  }
}
