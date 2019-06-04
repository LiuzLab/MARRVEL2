import { Component, OnChanges, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';

import { ApiService } from '../../../../services/api.service';
import { Animations } from './../../../../animations';

@Component({
  selector: 'app-omim',
  templateUrl: './omim.component.html',
  styleUrls: ['./omim.component.scss'],
  animations: [ Animations.fadeInOut ]
})
export class OmimComponent implements OnChanges {
  @Input() gene;
  @Input() loading;
  @Input() data;

  constructor(
    private api: ApiService
  ) { }

  ngOnChanges(change: SimpleChanges) {
  }

}
