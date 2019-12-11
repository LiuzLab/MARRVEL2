import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { MatAutocomplete, MatChipInputEvent, MatAutocompleteSelectedEvent } from '@angular/material';

import { ApiService } from '../../services/api.service';
import { Animations } from 'src/app/animations';
import { Gene, HumanGene } from 'src/app/interfaces/gene';

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss'],
  animations: [ Animations.toggleInOut ]
})
export class SearchBoxComponent implements OnInit {
  @Input() compact  = false;

  selectedInputType  = 'gene';
  gene: HumanGene | null;
  geneKeyword = '';
  protein  = '';
  variant  = '';
  variantType: string | null = null;
  modelGene: Gene | null;

  geneInputCtrl = new FormControl();
  variantInputCtrl = new FormControl('', [
    Validators.pattern(
        '(' +
          '^(Chr)?' +
          '(1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|18|19|20|21|22|X|Y|M)' + '\s*:\s*' +
          '([0-9]+)' + '\\s*' +
          '([ACGT]+)' + '\\s*>\\s*' +
          '([ACGT]+)$' +
        ')|' +

        '(' +
          '^(1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|18|19|20|21|22|X|Y|M)-' +
          '([0-9]+)-' +
          '([ACGT]+)-' +
          '([ACGT]+)$' +
        ')|' +

        '(' +
          '^[0-9a-zA-Z_\.]+:c\.[0-9]+(A|C|G|T)+>(A|C|G|T)+$' +
        ')'
    )
  ]);
  geneSuggestion = [];
  @ViewChild('geneInput') geneInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private api: ApiService
  ) { }

  ngOnInit() {
    this.route.url.subscribe(url => {
      if (url.length > 1) {
        if (url[0].path === 'human' && url[1].path === 'protein') {
          this.selectedInputType = 'protein';
          this.onInputTypeChange(null);
        } else if (url[0].path === 'model' && url[1].path === 'gene') {
          this.selectedInputType = 'modelgene';
          this.onInputTypeChange(null);
        }
      }
    });
  }

  onInputTypeChange(e) {
    if (this.selectedInputType === 'vcf') {
      this.router.navigate(['human', 'batch', 'vcf' ]);
    } else if (this.selectedInputType === 'multigenes') {
      this.router.navigate(['human', 'batch', 'genes' ]);
    }

    this.gene = null;
    this.geneKeyword = '';
    this.protein = '';
    this.variant = '';
    this.variantInputCtrl.setValue('');
    this.variantType = null;
  }

  onGeneInput(e) {
    this.geneKeyword = e.target.value;
    if (this.geneKeyword) {
      this.api.getGenesBySymbolPrefix(9606, this.geneKeyword)
        .subscribe((res) => {
          this.geneSuggestion = res;
        });
    } else {
      this.geneSuggestion = [];
    }
  }

  geneAutocompleteSelected(e: MatAutocompleteSelectedEvent) {
    const idx = e.option.value;
    this.gene = this.geneSuggestion[idx];
    this.geneKeyword = '';
    this.geneInput.nativeElement.value = '';
    this.geneInputCtrl.setValue(null);
  }

  addGene(e: MatChipInputEvent) {
    if (!this.matAutocomplete.isOpen) {
      const input = e.input;
      const value = e.value;

      if (value) {
        this.gene = this.geneSuggestion[value];
      }

      if (input) {
        input.value = '';
      }
      this.geneKeyword = '';
      this.geneInputCtrl.setValue(null);
      this.geneSuggestion = [];
    }
  }
  removeGene(gene) {
    this.gene = null;
    this.geneKeyword = '';
  }


  onVariantInput(e) {
    this.variant = e.target.value;
  }

  onModelGeneSelected(e) {
    this.modelGene = e;
  }

  validateInput() {
    if (this.selectedInputType === 'gene') {
      if (this.gene != null) {
        return this.variantInputCtrl.valid;
      } else {
        return this.variantInputCtrl.valid && this.variant !== '';
      }
    } else if (this.selectedInputType === 'protein') {
      return this.protein.trim() !== '';
    } else if (this.selectedInputType === 'modelgene') {
      return this.modelGene && this.modelGene.entrezId != null;
    }
    return false;
  }

  search() {
    if (this.selectedInputType === 'modelgene') {
      this.router.navigate([ 'model', 'gene', this.modelGene.entrezId ]);
    } else {
      let inputType  = 0;
      if (this.protein !== '') inputType |= 1;
      if (this.gene != null) inputType |= 2;
      if (this.variant !== '') inputType |= 4;

      switch (inputType) {
        case 1: {
          this.router.navigate(['human', 'protein', this.protein ]);
          break;
        }
        case 2: {
          this.router.navigate(['human', 'gene', this.gene.entrezId ]);
          break;
        }
        case 4: {
          this.router.navigate(['human', 'variant', this.variant ]);
          break;
        }
        case 6: {
          this.router.navigate(['human', 'gene', this.gene.entrezId, 'variant', this.variant]);
          break;
        }
        default: {
        break;
        }
      }
    }
  }

}
