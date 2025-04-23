import { Component, Input, OnInit } from '@angular/core';
import { Animations } from 'src/app/animations';
import { Variant } from 'src/app/interfaces/variant';
import { ApiService } from 'src/app/services/api.service';

interface TransVarResultCoord {
  annot: string;
  pos: number;
  ref: string;
  alt: string;
}
interface TransVarForwardAnnotResult {
  canonical?: {
    coord: TransVarResultCoord;
  };
  mostAgreed?: {
    coord: TransVarResultCoord;
  };
  candidates?: [{
    transcriptId: string;
    coord: TransVarResultCoord;
    isCanonical: boolean;
  }];
}

@Component({
  selector: 'app-forward-annotation',
  templateUrl: './forward-annotation.component.html',
  styleUrls: ['./forward-annotation.component.scss'],
  animations: [ Animations.toggleInOut ]
})
export class ForwardAnnotationComponent implements OnInit {
  @Input() variant: Variant;
  candidates;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.candidates = undefined;
    this.apiService.getForwardAnnotByVariant(this.variant)
      .subscribe((res: TransVarForwardAnnotResult) => {
        // Candidates are by transcripts: gather transcript IDs and if it is Ensembl canonical by annotations for display reason
        const trptsByAnnot = {};
        for (const candidate of (res.candidates || [])) {
          if (candidate.coord.annot) {
            trptsByAnnot[candidate.coord.annot] = trptsByAnnot[candidate.coord.annot] || [];
            trptsByAnnot[candidate.coord.annot].push({
              transcriptId: candidate.transcriptId,
              isCanonical: candidate.isCanonical,
              extLink: candidate.transcriptId.substring(0, 4) === 'ENST' ?
                `http://grch37.ensembl.org/Homo_sapiens/Transcript/Summary?t=${candidate.transcriptId}` :
                `https://www.ncbi.nlm.nih.gov/nuccore/?term=${candidate.transcriptId}`
            });
          }
        }

        if (Object.keys(trptsByAnnot).length) {
          // Save in an array form w. sorted trascript ID by whether it is canonical
          this.candidates = Object.keys(trptsByAnnot).map((annot) => {
            return {
              annot: annot,
              transcripts: trptsByAnnot[annot].sort((t1, t2) => {
                if (t1.isCanonical !== t2.isCanonical) {
                  return t1.isCanonical > t2.isCanonical ? -1 : 1;
                }
                return t1.transcriptId < t2.transcriptId ? -1 : 1;
              })
            };
          }).sort((a1, a2) => {   // One with a canonical transcript goes first. The others sorted by anotation
            if (a1.transcripts[0].isCanonical !== a2.transcripts[0].isCanonical) {
              return (a1.transcripts[0].isCanonical > a2.transcripts[0].isCanonical) ? -1 : 1;
            }
            return a1.annot < a2.annot ? -1 : 1;
          });
        }
      }, (err) => {
        this.candidates = undefined;
      });
  }

}
