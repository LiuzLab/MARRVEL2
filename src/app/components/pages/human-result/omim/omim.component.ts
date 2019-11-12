import { Component, Input } from '@angular/core';

import { Animations } from './../../../../animations';

@Component({
  selector: 'app-omim',
  templateUrl: './omim.component.html',
  styleUrls: ['./omim.component.scss'],
  animations: [ Animations.fadeInOut, Animations.toggleInOut ]
})
export class OmimComponent {
  @Input() gene;
  @Input() loading;
  @Input() data;

  constructor() { }

}
