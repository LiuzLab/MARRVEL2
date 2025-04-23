import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  scrollTo(id: string) {
    window.document.getElementById(id).scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

}
