import { Component, OnInit, Output, ViewChild, ElementRef, EventEmitter } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatAutocomplete, MatChipInputEvent, MatAutocompleteSelectedEvent } from '@angular/material';

import { ApiService } from 'src/app/services/api.service';
import { Gene } from 'src/app/interfaces/gene';

@Component({
  selector: 'app-model-gene-search',
  templateUrl: './model-gene-search.component.html',
  styleUrls: ['./model-gene-search.component.scss']
})
export class ModelGeneSearchComponent implements OnInit {
  @Output() geneSelected: EventEmitter< Gene > = new EventEmitter();

  taxonId = '7227';

  gene: Gene | null;
  geneKeyword: string | null;
  geneInputCtrl = new FormControl();
  geneSuggestion = [];
  @ViewChild('geneInput') geneInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(private api: ApiService) { }

  ngOnInit() {
  }

  onModelChange() {
    this.removeGene();
    this.geneSuggestion = [];
    this.geneInputCtrl.setValue(null);
  }

  onGeneInput(e) {
    this.geneKeyword = e.target.value;
    if (this.geneKeyword) {
      this.api.getGenesBySymbolPrefix(+this.taxonId, this.geneKeyword)
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
    this.geneSelected.emit(this.gene);
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

        this.geneSelected.emit(this.gene);
      }

      if (input) {
        input.value = '';
      }
      this.geneKeyword = '';
      this.geneInputCtrl.setValue(null);
      this.geneSuggestion = [];
    }
  }
  removeGene() {
    this.gene = null;
    this.geneKeyword = '';

    this.geneSelected.emit(null);
  }



}
