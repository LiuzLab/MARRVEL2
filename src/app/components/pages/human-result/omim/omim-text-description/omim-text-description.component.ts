import { Component, OnInit, Input } from '@angular/core';
import { HumanGene } from '../../../../../interfaces/gene';

import { Animations } from '../../../../../animations';

@Component({
  selector: 'app-omim-text-description',
  templateUrl: './omim-text-description.component.html',
  styleUrls: ['./omim-text-description.component.scss'],
  animations: [ Animations.fadeInOut ]
})
export class OmimTextDescriptionComponent implements OnInit {
  @Input() gene: HumanGene;
  @Input() loading;
  @Input() data;

  showingContents = true;

  constructor() { }

  ngOnInit() {
  }

}
