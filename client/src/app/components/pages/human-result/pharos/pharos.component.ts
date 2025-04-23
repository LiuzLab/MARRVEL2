import { Component, OnInit, Input } from '@angular/core';

import { HumanGene } from 'src/app/interfaces/gene';
import { ApiService } from 'src/app/services/api.service';
import { Animations } from 'src/app/animations';

@Component({
  selector: 'app-pharos',
  templateUrl: './pharos.component.html',
  styleUrls: ['./pharos.component.scss'],
  animations: [ Animations.toggleInOut ]
})
export class PharosComponent implements OnInit {
  @Input() gene: HumanGene;

  loading = false;
  data;

  idgDevLevTrans = {
    'Tdark': 'Little is known about this target',
    'Tbio': 'No known drugs for this target',
    'Tchem': 'This target has at least one CHEMBL compound',
    'Tclin': 'This target has at least one approved drug'
  };

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.loading = true;
    this.api.getPharosTargetsByEntrezId(this.gene.entrezId)
      .subscribe(res => {
        this.data = res;
        this.loading = false;
      }, err => {
        this.data = null;
        this.loading = false;
      });
  }

  getDevTrans(devTag, targetName) {
    return this.idgDevLevTrans[devTag].replace(/this\starget/i, targetName);
  }

}
