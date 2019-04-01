import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-scroll-top-button',
  templateUrl: './scroll-top-button.component.html',
  styleUrls: ['./scroll-top-button.component.scss']
})
export class ScrollTopButtonComponent implements OnChanges {
  @Input() right = '12px';

  constructor() { }

  ngOnChanges() {
    window.document.getElementById('scroll-to-top').style['right'] = this.right;
  }

  scrollToTop() {
    window.document.getElementById('TOP').scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }

}
