import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material';

import { ApiService } from '../../services/api.service';

import { MULTIGENE_EXAMPLE } from './multiple-genes-example';

@Component({
  selector: 'app-multiple-gene-box',
  templateUrl: './multiple-gene-box.component.html',
  styleUrls: ['./multiple-gene-box.component.scss'],
})
export class MultipleGeneBoxComponent implements OnInit {
  genes: object[] = [];

  geneKeyword = '';
  geneInputCtrl = new FormControl();
  geneSuggestion = [];
  @ViewChild('geneInput') geneInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  @Output() searchClick: EventEmitter< any > = new EventEmitter();

  constructor(
    private api: ApiService
  ) { }

  ngOnInit() {
  }

  onGeneInput(e) {
    this.geneKeyword = e.target.value;
    if (this.geneKeyword) {
      this.api.getGenesBySymbolPrefix(9606, this.geneKeyword)
        .subscribe((res) => {
          this.geneSuggestion = res;
        });
    }
    else {
      this.geneSuggestion = [];
    }
  }

  geneAutocompleteSelected(e: MatAutocompleteSelectedEvent) {
    const idx = e.option.value;
    this.genes.push(this.geneSuggestion[idx]);
    this.geneKeyword = '';
    this.geneInput.nativeElement.value = '';
    this.geneInputCtrl.setValue(null);
  }

  removeGene(targetGene) {
    let targetIdx = -1;
    for (let i = 0; i < this.genes.length; ++i) {
      const gene = this.genes[i];
      if (targetGene['entrezId'] === gene['entrezId']) {
        targetIdx = i;
        break;
      }
    }

    if (targetIdx >= 0) {
      this.genes.splice(targetIdx, 1);
    }
  }

  validateInput() {
    return this.genes.length > 0;
  }

  search() {
    this.searchClick.emit(this.genes);
  }
  searchExample() {
    this.searchClick.emit(MULTIGENE_EXAMPLE);
  }

}
