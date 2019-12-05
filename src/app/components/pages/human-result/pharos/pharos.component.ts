import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

import { HumanGene } from 'src/app/interfaces/gene';
import { ApiService } from 'src/app/services/api.service';
import { Animations } from 'src/app/animations';

@Component({
  selector: 'app-pharos',
  templateUrl: './pharos.component.html',
  styleUrls: ['./pharos.component.scss'],
  animations: [ Animations.toggleInOut ]
})
export class PharosComponent implements OnInit, AfterViewInit {
  @Input() gene: HumanGene;

  loading = false;
  data;

  @ViewChild('pharosColumn') pharosColumn: ElementRef;
  idgDevLevTrans = {
    'Tdark': 'Little is known about this target',
    'Tbio': 'No known drugs for this target',
    'Tchem': 'Target has at least one CHEMBL compound',
    'Tclin': 'Target has at least one approved drug'
  };

  constructor(private api: ApiService) { }

  ngAfterViewInit() {
    console.log(this.pharosColumn);
  }

  ngOnInit() {
    this.loading = true;
    this.api.getPharosTargetsByEntrezId(this.gene.entrezId)
      .subscribe(res => {
        console.log(res);
        this.data = res;
        this.loading = false;
      }, err => {
        this.data = null;
        this.loading = false;
      });
  }

}
