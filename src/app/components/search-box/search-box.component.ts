import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { MatAutocomplete, MatChipInputEvent, MatAutocompleteSelectedEvent } from '@angular/material';

import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss']
})
export class SearchBoxComponent implements OnInit {
  @Input() compact  = false;

  selectedInputType  = 'gene';
  gene: object | null;
  geneKeyword = '';
  protein  = '';
  variant  = '';

  geneInputCtrl = new FormControl();
  geneSuggestion = [];
  @ViewChild('geneInput') geneInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(
    private router: Router,
    private api: ApiService
  ) { }

  ngOnInit() {
  }

  onInputTypeChange(e) {
    this.gene = null;
    this.geneKeyword = '';
    this.protein = '';
    this.variant = '';
  }

  onGeneInput(e) {
    this.geneKeyword = e.target.value;
    console.log(this.geneKeyword);
    if (this.geneKeyword) {
      this.api.getGenesBySymbolPrefix(9606, this.geneKeyword)
        .subscribe((res) => {
          this.geneSuggestion = res;
          console.log(this.geneSuggestion);
        });
    }
    else {
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

  search() {
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
        this.router.navigate(['human', 'gene', this.gene['entrezId'] ]);
        break;
      }
      case 4: {
        this.router.navigate(['human', 'variant', this.variant ]);
        break;
      }
      case 6: {
        this.router.navigate(['human', 'pair', this.gene['entrezId'], this.variant]);
        break;
      }
      default: {
       break;
      }
    }
  }

}
