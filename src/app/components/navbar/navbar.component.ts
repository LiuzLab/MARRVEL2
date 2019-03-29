import { Component, OnInit, Input } from '@angular/core';

import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  animations: [
    trigger('toggle', [
      state('true', style({ opacity: 1, height: '12em' })),
      state('void', style({ opacity: 0, height: '0em' })),
      transition(':enter', animate('500ms ease-in-out')),
      transition(':leave', animate('500ms ease-in-out'))
    ])
  ]
})
export class NavbarComponent implements OnInit {
  @Input() elevation = false;
  @Input() showSearch = false;
  @Input() fixed = false;

  searchOpened = false;

  constructor() { }

  ngOnInit() {
  }

}
