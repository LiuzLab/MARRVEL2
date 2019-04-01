import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-human-result',
  templateUrl: './human-result.component.html',
  styleUrls: ['./human-result.component.scss']
})
export class HumanResultComponent implements OnInit {
  pageLoading = true;
  sidenavOpened = false;

  geneEntrezId: number | null;
  variantInput: string | null;
  proteinInput: string | null;

  gene: HumanGene | null;
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
    private api: ApiService
  ) { }

  requestAPIs() {
    if (this.gene.xref.omimId) {
      this.omimLoading = true;
      this.api.getOMIMByMimNumber(this.gene.xref.omimId)
        .subscribe((res) => {
          console.log(res);
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
        console.log(res);
        this.clinVar = res;
        this.clinVarLoading = false;
      });

    this.gnomADGeneLoading = true;
    this.api.getGnomADGeneByEntrezId(this.gene.entrezId)
      .subscribe((res) => {
        console.log(res);
        this.gnomADGene = res;
        this.gnomADGeneLoading = false;
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
            console.log(this.gene);

            this.requestAPIs();
          });
      }
    });
  }

  toggleSidenav(e) {
    this.sidenavOpened = e.sidenavOpened;
  }
}

interface XRef {
  ucscId?: string;
  omimId?: number;
  vegaId?: string;
  ensemblId?: string;
}

interface Gene {
  taxonId: number;
  symbol: string;
  entrezId: number;
  xref?: XRef;
  name?: string;
  status?: string;
  alias?: string[];
  locusType?: string;
  chr?: string;
  location?: string;
  type?: string;
}

interface HumanGene extends Gene {
  hgncId?: number;
}
