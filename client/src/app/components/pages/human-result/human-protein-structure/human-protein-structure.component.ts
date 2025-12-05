import { Component, Input, OnInit } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-human-protein-structure',
  templateUrl: './human-protein-structure.component.html',
  styleUrls: ['./human-protein-structure.component.scss']
})
export class HumanProteinStructureComponent implements OnInit {
  @Input() uniprotId: string;

  constructor() { }

  ngOnInit() {
  }

}
