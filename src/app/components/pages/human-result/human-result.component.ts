import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';

import { ApiService } from '../../../services/api.service';
import { VariantService } from '../../../services/variant.service';

import { HumanGene } from '../../../interfaces/gene';
import { Variant } from '../../../interfaces/variant';

import { Animations } from 'src/app/animations';
import { MatSelectChange } from '@angular/material';

@Component({
  selector: 'app-human-result',
  templateUrl: './human-result.component.html',
  styleUrls: ['./human-result.component.scss'],
  animations: [ Animations.fadeInOut, Animations.toggleInOut ]
})
export class HumanResultComponent implements OnInit {
  geneLoading = true;
  sidenavOpened = true;

  // Input
  geneEntrezId: number | null;
  variantInput: string | null;
  proteinInput: string | null;

  // Processed input
  gene: HumanGene | null = null;
  variant: Variant | null = null;
  variantString: string;

  // Data from server
  geneCandidates: HumanGene[] | null = null;

  omimLoading = true;
  omimData = null;

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
        this.geneLoading = true;
        this.api.getGeneByEntrezId(this.geneEntrezId)
          .pipe(take(1))
          .subscribe((res) => {
            this.onGeneLoad(res);
          });
      }

      if (this.variantInput !== null && this.variantInput !== '') {
        const parsed = this.variantService.parse(this.variantInput);
        if (!parsed.valid) {
          // TODO: error
        } else if (parsed.type === 'hgvs') {
          // TODO: Request hgvs --> coordinate
          this.api.getGenomLocByHgvsVar(this.variantInput)
            .pipe(take(1))
            .subscribe(res => {
              this.geneEntrezId = res.gene.entrezId;
              this.variant = {
                chr: res.chr,
                pos: res.pos,
                ref: res.ref,
                alt: res.alt
              };
              this.variantString = `Chr${res.chr}:${res.pos} ${res.ref}>${res.alt}`;
              this.gene = res.gene;
              this.geneLoading = false;
              this.onGeneLoad(res.gene);
            }, err => {
              console.log(err);
              // TODO: error
            });
        } else if (parsed.type === 'coord') {
          this.variant = parsed.variant;
          this.variantString = `Chr${this.variant.chr}:${this.variant.pos} ${this.variant.ref}>${this.variant.alt}`;

          if (!this.geneEntrezId && !this.gene) {
            this.geneLoading = true;
            this.geneCandidates = null;
            this.api.getGeneByGenomicLocation(this.variant)
              .pipe(take(1))
              .subscribe((res: HumanGene[]) => {
                this.geneCandidates = res;
                if (res && res.length) {
                  this.onGeneLoad(res[0]);
                }
              });
          }
        } else {
          // TODO: error
        }
      }
    });
  }

  onGeneSelectionChange(e: MatSelectChange) {
    this.onGeneLoad(e.value);
  }

  onGeneLoad(gene) {
    this.gene = gene;
    this.geneLoading = false;

    this.getOMIM();
    this.getOrthologs();
  }

  getOMIM() {
    if (!this.gene || !this.gene.xref || !this.gene.xref.omimId) {
      this.omimData = null;
      this.omimLoading = false;
      return;
    }

    this.omimLoading = true;
    this.api.getOMIMByMimNumber(this.gene.xref.omimId)
      .pipe(take(1))
      .subscribe(res => {
        this.omimData = res;
        this.omimLoading = false;
      }, err => {
        console.log(err);
        this.omimData = null;
        this.omimLoading = false;
      });
  }

  getOrthologs() {
    this.orthologsLoading = true;
    this.api.getOrthologByEntrezId(this.gene.entrezId)
      .pipe(take(1))
      .subscribe((res) => {
        this.orthologs = res;
        this.orthologsLoading = false;
      });
  }

  toggleSidenav(e) {
    this.sidenavOpened = e.sidenavOpened;
  }
}
