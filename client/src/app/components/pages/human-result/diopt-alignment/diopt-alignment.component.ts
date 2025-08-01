import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { take } from 'rxjs/operators';

import { ApiService } from 'src/app/services/api.service';
import { Gene } from './../../../../interfaces/gene';
import { Animations } from './../../../../animations';

@Component({
  selector: 'app-diopt-alignment',
  templateUrl: './diopt-alignment.component.html',
  styleUrls: ['./diopt-alignment.component.scss'],
  animations: [ Animations.toggleInOut ]
})
export class DioptAlignmentComponent implements OnInit {
  @Input() gene: Gene;
  data = null;
  domainData = null;
  loading = true;
  versionName = '7.0';

  species = null;
  speciesTagToName = {
    hs: 'Homo Sapiens (Human)',
    mm: 'Mus musculus (Mouse)',
    rn: 'Rattus norvegicus (Rat)',
    xt: 'Xenopus tropicalis (Frog)',
    dr: 'Danio rerio (Zebrafish)',
    dm: 'Drosophila melanogaster (Fly)',
    ce: 'Caenorhabditis Elegans (Worm)',
    sc: 'Saccharomyces cerevisiae (Yeast)',
    sp: 'Schizosaccharomyces pombe (Fission yeast)',
  };

  highlightFrom = null;
  highlightTo = null;
  speciesToHighlight = {
    hs: true, mm: false, rn: false, xt: false,
    dr: false, dm: false, ce: false, sc: false, sp: false,
  };

  constructor(
    private api: ApiService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    if (this.gene && this.gene.entrezId) {
      this.loading = true;
      this.api.getAlignmentByEntrezId(this.gene.entrezId)
        .pipe(take(1))
        .subscribe(res => {
          this.versionName = res.dioptVersion || this.versionName;
          if (res && res.data && res.data.length) {
            const speciesObj = {};
            for (const row of res.data) {
              if (row.species in this.speciesToHighlight) {
                speciesObj[row.species] = true;
              }
              row.display = row.species === 'mark' || row.species in this.speciesToHighlight;
            }
            this.species = Object.keys(speciesObj);
          }

          this.data = res ? res.data : null;
          this.domainData = res ? res.domain : null;
          this.loading = false;
        }, err => {
          console.log(' > error alignment');
          this.loading = false;
          this.data = null;
          this.domainData = null;
        });
    }
  }

  getHtml() {
    let htmlString = '';
    for (const row of this.data) {
      if (!row.display) {
        continue;
      }

      if (row.species !== 'mark') {
        htmlString += '<div>';
        htmlString += '<div class="species-tag d-inline-block align-middle">' +
          `<span>${ row.species }${ row.sIdx != null ? row.sIdx : '' }</span></div>`;
        for (let idx = 0; idx < row.proteins.length; ++idx) {
          if (this.speciesToHighlight[row.species] &&
            this.highlightFrom <= row.realIdx[idx] && row.realIdx[idx] <= this.highlightTo) {
            htmlString += `<span class="d-inline-block text-highlight-accent ${row.style[idx]}">${row.proteins[idx]}</span>`;
          } else {
            htmlString += `<span class="d-inline-block ${row.style[idx]}">${row.proteins[idx]}</span>`;
          }
        }
        htmlString += `<span class="ml-2 d-inline-block">[${ row.endIdx }]</span></div>`;
      } else {
        if (row.mark.length && row.mark[0] === ' ') {
          htmlString += `<div class="mb-2">
            <span class="mark d-inline-block">${ row.mark.substring(4) }</span>
          </div>`;
        } else {
          htmlString += `<div class="mb-2">
            <span class="mark d-inline-block">${ row.mark }</span>
          </div>`;
        }
      }
    }
    return htmlString;
  }

  highlightDomain(e, species?: string) {
    if (species) {
      const toHighlight = {
        hs: false, mm: false, rn: false, dr: false, xt: false,
        dm: false, ce: false, sc: false, sp: false,
      };
      const sTags = species.split(';');
      for (const tag of sTags) {
        toHighlight[tag] = true;
      }
      this.speciesToHighlight = toHighlight;
    }
    this.setHighlightFrom(e.from);
    this.setHighlightTo(e.to);
  }

  setHighlightFrom(from) {
    from = parseInt(from, 10);
    this.highlightFrom = from >= 0 ? from : null;
  }
  setHighlightTo(to) {
    to = parseInt(to, 10);
    this.highlightTo = to >= 0 ? to : null;
  }
  scrollToAlignment() {
    window.document.getElementById('alignment-highlight').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
