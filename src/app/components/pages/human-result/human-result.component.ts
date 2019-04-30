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
  omimData: object | null;
  orthologsLoading = false;
  orthologs: object[] | null;

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private variantService: VariantService
  ) { }

  ngOnInit() {
    this.route.params.subscribe((param) => {
      this.geneEntrezId = param.gene ? +param.gene : null;
      this.variantInput = param.variant || null;
      this.proteinInput = param.protein || null;

      if (this.geneEntrezId !== null) {
        this.api.getGeneByEntrezId(this.geneEntrezId)
          .subscribe((res) => {
            this.gene = res;
            console.log(this.gene);

            this.getOrthologs();
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
        }
        else {
          // TODO: error
        }
      }
    });
  }

  getOrthologs() {
    this.orthologsLoading = true;
    this.api.getOrthologByEntrezId(this.gene.entrezId)
      .subscribe((res) => {
        this.orthologs = res;
        this.orthologsLoading = false;

        console.log(res);
      });
  }

  omimDataChange(e) {
    this.omimData = e;
  }

  toggleSidenav(e) {
    this.sidenavOpened = e.sidenavOpened;
  }
}
