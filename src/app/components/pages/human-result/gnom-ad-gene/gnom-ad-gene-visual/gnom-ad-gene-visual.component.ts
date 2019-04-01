import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-gnom-ad-gene-visual',
  templateUrl: './gnom-ad-gene-visual.component.html',
  styleUrls: ['./gnom-ad-gene-visual.component.scss']
})
export class GnomADGeneVisualComponent implements OnInit {
  @Input() oeLower;
  @Input() oeUpper;
  @Input() oe;

  constructor() { }

  ngOnInit() {
  }

  min(a, b) {
    return Math.min(a, b);
  }
  max(a, b) {
    return Math.max(a, b);
  }

}
