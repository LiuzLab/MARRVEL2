import { Component, OnInit, Input } from '@angular/core';

import { HumanGene } from '../../../../interfaces/gene';
import { StringData } from './string-data.interface';

import { PpiService } from '../../../../services/ppi.service';

@Component({
  selector: 'app-ppi',
  templateUrl: './ppi.component.html',
  styleUrls: ['./ppi.component.scss']
})
export class PpiComponent implements OnInit {
  @Input() gene: HumanGene;
  stringData: StringData[];
  stringLoading = true;

  constructor(private ppiService: PpiService) { }

  ngOnInit(): void {
    this.loadStringData();
  }

  loadStringData() {
    this.stringLoading = true;
    this.ppiService.getString(this.gene.entrezId).subscribe({
      next: (data) => {
        this.stringData = data;
        this.stringLoading = false;
        console.log(this.stringData[0]);
      },
      error: (error) => {
        console.error('Error loading string data:', error);
        this.stringLoading = false;
      }
    });
  }
}
