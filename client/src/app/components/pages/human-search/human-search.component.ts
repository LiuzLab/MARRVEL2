import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { SearchService } from '../../../services/search.service';
import { GeneService } from '../../../services/gene.service';

import { HumanGene } from '../../../interfaces/gene';

@Component({
  selector: 'app-human-search',
  templateUrl: './human-search.component.html',
  styleUrls: ['./human-search.component.scss']
})
export class HumanSearchComponent implements OnInit {
  keyword?: string;
  genes?: HumanGene[];
  loading = false;
  error = false;
  urlPostfix = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private searchSvc: SearchService,
    private geneSvc: GeneService,
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.keyword = params.keyword || '';
      this.urlPostfix = '';
      if (params.variant?.length) {
        this.urlPostfix += '/variant';
        if (params.genomeBuild === 'hg38') {
          this.urlPostfix += '/hg38';
        }
        this.urlPostfix += '/' + params.variant;
      }
      this.search(this.keyword);
    });
  }

  search(keyword: string): void {
    this.error = false;
    this.loading = true;
    this.geneSvc.searchBySymbol(keyword, 9606).subscribe({
      next: (genes: HumanGene[]) => {
        if (genes[0]?.symbol.toLowerCase() === keyword.toLowerCase()) {
          // treat it as the exact match
          if (this.urlPostfix.length) {
            this.router.navigate(['/human/gene', genes[0].entrezId, this.urlPostfix]);
          } else {
            this.router.navigate(['/human/gene', genes[0].entrezId]);
          }
        } else {
          this.genes = genes;
        }
        this.loading = false;
      },
      error: (err) => {
        console.log(err);
        this.error = true;
        this.loading = false;
      }
    });
  }

  getSymbol(gene: HumanGene) {
    return gene.symbol.replace(new RegExp(`(${this.keyword})`, 'ig'),
      (_, g1) => `<span class="text-highlight">${g1}</span>`);
  }

  getAlias(gene: HumanGene) {
    return [
      ...(gene.alias || []),
      ...(gene.prevSymbols || []),
    ].filter((val, idx, arr) => val?.length && arr.indexOf(val) === idx)     // Get unique
      .map((e) => e.replace(new RegExp(`(${this.keyword})`, 'ig'),    // highlight keyword
        (_, g1) => `<span class="text-highlight">${g1}</span>`))
      .join(', ');
  }
}
