import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';

import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-model-gene-human-orthologs',
  templateUrl: './model-gene-human-orthologs.component.html',
  styleUrls: ['./model-gene-human-orthologs.component.scss']
})
export class ModelGeneHumanOrthologsComponent implements OnInit {
  entrezId: number | null;

  loading = true;
  data;

  taxonIdToName = {
    7227: 'Drosophila Melanogaster',
    6239: 'Caenorhabditis Elegans',
    7955: 'Danio Rerio',
    9606: 'Homo Sapiens',
    10090: 'Mus Musculus',
    10116: 'Rattus Norvegicus'
  };
  taxonIdToCName = {
    7227: 'Fly',
    6239: 'Worm',
    7955: 'Zebrafish',
    9606: 'Human',
    10090: 'Mouse',
    10116: 'Rat'
  };

  constructor(
    private route: ActivatedRoute,
    private api: ApiService
  ) { }

  ngOnInit() {
    this.route.params.subscribe((param) => {
      this.entrezId = +param.gene || null;

      this.api.getOrthologByEntrezId(this.entrezId)
        .pipe(take(1))
        .subscribe(res => {
          this.loading = false;
          this.data = res.filter(e => e.taxonId2 === 9606).sort((e1, e2) => {
            if (e1.score > e2.score) {
              return -1;
            } else if (e1.score === e2.score) {
              if (e1.bestScoreRev) {
                return !e2.bestScoreRev ? -1 : (e1.symbol < e2.symbol ? -1 : 1);
              } else {
                return 1;
              }
            } else {
              return 1;
            }
          });
          console.log(this.data);
        }, err => {
          this.loading = false;
          this.data = null;
        });
    });
  }

}
