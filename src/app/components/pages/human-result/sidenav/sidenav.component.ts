import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
  @Input() gene: object | null;
  @Input() variant: string | null;
  @Output() change: EventEmitter<any> = new EventEmitter();

  sidenavOpened = true;

  constructor() { }

  ngOnInit() {
  }

  toggleSidenav() {
    this.sidenavOpened = !this.sidenavOpened;
    this.change.emit({
      sidenavOpened: this.sidenavOpened
    });
  }

}
