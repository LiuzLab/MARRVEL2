import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

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
  selectedEntrezIds = {};
  @ViewChild('geneInput', { static: true }) geneInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;
  showAutocomplete = false;

  @Output() searchClick: EventEmitter< any > = new EventEmitter();

  constructor(
    private api: ApiService
  ) { }

  ngOnInit() {
  }

  onGeneInput(e) {
    this.showAutocomplete = true;
    this.geneKeyword = e.target.value;
    if (this.geneKeyword) {
      this.api.getGenesBySymbolPrefix(9606, this.geneKeyword)
        .subscribe((res) => {
          this.geneSuggestion = res.map(gene => {
            gene.selected = (this.selectedEntrezIds[gene.entrezId] === true);
            return gene;
          });
        });
    } else {
      this.geneSuggestion = [];
    }
  }

  closeAutocomplete() {
    this.showAutocomplete = false;
  }

  toggleGene(aGene) {
    if (aGene.selected) {
      this.removeGene(aGene);
    } else {
      this.addGene(aGene);
    }
  }

  addGene(aGene) {
    this.selectedEntrezIds[aGene.entrezId] = true;
    this.genes.push(aGene);
    aGene.selected = true;
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
    targetGene.selected = false;
    this.selectedEntrezIds[targetGene.entrezId] = false;
    for (const gene of this.geneSuggestion) {
      if (gene.entrezId === targetGene.entrezId) {
        gene.selected = false;
      }
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
