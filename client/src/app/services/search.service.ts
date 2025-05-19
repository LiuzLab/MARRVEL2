import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { HumanGene } from '../interfaces/gene';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(
    private router: Router
  ) { }

  redirect(inputType?: 'gene' | 'protein',
    gene?: HumanGene, variant?: string, genomeBuild?: 'hg19' | 'hg38'): Promise< boolean > {
    inputType = inputType || 'gene';

    if (inputType === 'protein') {
      return this.router.navigate(['human', 'protein', variant ]);
    }

    const GENE = 2;
    const VARIANT = 1;
    let inputTypeCode = 0;
    if (gene) {
      inputTypeCode |= GENE;
    }
    if (variant?.length) {
      inputTypeCode |= VARIANT;
    }

    const route = ['human'];
    if (inputTypeCode & GENE) {
      route.push('gene');
      route.push(gene.entrezId.toString());
    }
    if (inputTypeCode & VARIANT) {
      switch (genomeBuild) {
        case 'hg19':
          route.push(...['variant', variant]);
          break;
        case 'hg38':
          route.push(...['variant', 'hg38', variant]);
          break;
      }
    }
    return this.router.navigate(route);
  }
}
