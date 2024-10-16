import { Component, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnChanges {
  @Input() gene: object | null;
  @Input() variant: string | null;
  @Output() change: EventEmitter<any> = new EventEmitter();

  @Input() sidenavOpened = true;

  constructor() { }

  ngOnChanges(): void {
  }

  toggleSidenav(): void {
    this.sidenavOpened = !this.sidenavOpened;
    this.change.emit({
      sidenavOpened: this.sidenavOpened
    });
  }

  scrollTo(id: string): void {
    this.change.emit({
      scrollTo: id
    });
  }
}
