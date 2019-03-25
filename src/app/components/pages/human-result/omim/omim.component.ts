import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-omim',
  templateUrl: './omim.component.html',
  styleUrls: ['./omim.component.scss']
})
export class OmimComponent implements OnInit {
  @Input() gene;
  @Input() data;

  constructor() { }

  ngOnInit() {
  }

}
