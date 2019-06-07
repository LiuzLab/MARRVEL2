import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { ApiService } from 'src/app/services/api.service';
import { Gene } from './../../../../interfaces/gene';
import { Animations } from './../../../../animations';

@Component({
  selector: 'app-diopt-alignment',
  templateUrl: './diopt-alignment.component.html',
  styleUrls: ['./diopt-alignment.component.scss'],
  animations: [ Animations.toggleInOut ]
})
export class DioptAlignmentComponent implements OnChanges {
  @Input() gene: Gene;
  data = null;
  domainData = null;
  loading = true;

  species = null;
  speciesTagToName = {
    hs: 'Homo Sapiens (Human)',
    mm: 'Mus musculus (Mouse)',
    rn: 'Rattus norvegicus (Rat)',
    dr: 'Danio rerio (Zebrafish)',
    dm: 'Drosophila melanogaster (Fly)',
    ce: 'Caenorhabditis Elegans (Worm)',
    sc: 'Saccharomyces cerevisiae (Yeast)',
    sp: 'Schizosaccharomyces pombe (Fission yeast)'
  };

  highlightFrom = null;
  highlightTo = null;
  speciesToHighlight = {
    hs: true, mm: true, rn: true, dr: true,
    dm: true, ce: true, sc: true, sp: true,
  };

  constructor(
    private api: ApiService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.gene && changes.gene.currentValue) {
      this.loading = true;
      this.api.getAlignmentByEntrezId(this.gene.entrezId)
        .subscribe(res => {
          console.log(res);

          if (res && res.data && res.data.length) {
            const speciesObj = {};
            for (const row of res.data) {
              if (row.species in this.speciesToHighlight) {
                speciesObj[row.species] = true;
              }
              row.display = row.species in this.speciesToHighlight;
            }
            this.species = Object.keys(speciesObj);
            console.log(this.species);
          }

          this.data = res ? res.data : null;
          this.domainData = res ? res.domain : null;
          this.loading = false;
        }, err => { this.loading = false; });
    }
  }

  getStyle(styleString) {
    return this.sanitizer.bypassSecurityTrustStyle(styleString);
  }

  highlightDomain(e) {
    this.setHighlightFrom(e.from);
    this.setHighlightTo(e.to);
  }

  setHighlightFrom(from) {
    from = parseInt(from);
    this.highlightFrom = from >= 0 ? from : null;
  }
  setHighlightTo(to) {
    to = parseInt(to);
    this.highlightTo = to >= 0 ? to : null;
  }
  scrollToAlignment() {
    window.document.getElementById('alignment-highlight').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
