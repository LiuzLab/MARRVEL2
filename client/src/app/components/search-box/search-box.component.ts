import { Component, OnInit, Input, ViewChild, ElementRef, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

import { ApiService } from '../../services/api.service';
import { GeneService } from '../../services/gene.service';
import { SearchService } from '../../services/search.service';

import { Animations } from 'src/app/animations';

import { Gene, HumanGene } from 'src/app/interfaces/gene';

@Component({
  selector: 'app-youtube-dialog',
  templateUrl: 'youtube-dialog.html',
})
export class YoutubeDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<YoutubeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss'],
  animations: [ Animations.toggleInOut ]
})
export class SearchBoxComponent implements OnInit {
  @Input() compact  = false;

  selectedInputType  = 'gene';
  gene: HumanGene | null = null;
  geneKeyword = '';
  protein  = '';
  variant  = '';
  genomeBuild: 'hg19' | 'hg38' = 'hg38';
  modelGene: Gene | null = null;

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
    private api: ApiService,
    private geneSvc: GeneService,
    private searchSvc: SearchService,
    public dialog: MatDialog,
    private sanitizer: DomSanitizer
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
  }

  onGeneInput(e: KeyboardEvent, value: string): void {
    if (this.geneKeyword === value) {
      return;
    }
    this.geneKeyword = value;
    const keyword = value;
    if (keyword) {
      this.api.getGenesBySymbolPrefix(9606, keyword)
        .subscribe((res) => {
          if (keyword === this.geneKeyword) {
            this.geneSuggestion = res;
          }
        });
    } else {
      this.geneSuggestion = [];
    }
  }

  onEnterKey(value?: string): void {
    if (this.gene) {
      // Gene is selected from autocomplete
      this.getResult();
      return;
    }

    const keyword = value ? value.trim() : this.geneInputCtrl.value?.trim();
    if (keyword?.length) {
      // some characters in gene input box => search
      this.search(keyword);
    } else {
      // no gene keyword (triggered by variant box) => redirect to result page
      this.variantInputCtrl.markAsTouched();
      this.getResult();
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

  getResult(): void {
    if (this.variantInputCtrl.invalid) {
      return;
    }

    switch (this.selectedInputType) {
      case 'modelgene':
        this.router.navigate([ 'model', 'gene', this.modelGene.entrezId ]);
        break;
      case 'protein':
        this.searchSvc.redirect('protein', null, this.protein);
        break;
      default:
        this.searchSvc.redirect(this.selectedInputType as 'gene' | 'protein',
          this.gene, this.variant, this.genomeBuild);
        break;
    }
  }

  search(keyword?: string): void {
    this.router.navigate(['search', 'human'], { queryParams: {
      keyword: keyword || this.geneInputCtrl.value || '',
      variant: this.variant || ''
    } });
  }

  openYouTubeDialog() {
    const dialogRef = this.dialog.open(YoutubeDialogComponent, {
      width: '608px',
      data: { url: this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/e1Qy3HC3gLo') }
    });
  }

}
