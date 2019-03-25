import { Component, OnInit, Input, Output  } from '@angular/core';
import { EventEmitter } from 'events';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  @Input() elevation: boolean;
  @Input() showSearch: boolean = false;
  @Input() fixed: boolean = false;

  constructor() { }

  ngOnInit() {
  }

}
