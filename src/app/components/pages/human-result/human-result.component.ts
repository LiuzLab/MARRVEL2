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
    this.api.getGnomADVaraint(this.variant)
      .subscribe((res) => {
        console.log(res);
        this.gnomAD = res;
        this.gnomADLoading = false;
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
