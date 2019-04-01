import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-gnom-ad-gene',
  templateUrl: './gnom-ad-gene.component.html',
  styleUrls: ['./gnom-ad-gene.component.scss']
})
export class GnomADGeneComponent implements OnInit {
  @Input() symbol: string;
  @Input() data: GnomADGeneSummary;

  constructor() { }

  ngOnInit() {
  }

}

interface GnomADGeneSummary {
  ensemblId: string;
  mis: {
    oeLower: number | null;
    oeUpper: number | null;
    obs: number | null;
    oe: number | null;
    exp: number | null;
    z: number | null;
  };
  syn: {
    oeLower: number | null;
    oeUpper: number | null;
    obs: number | null;
    oe: number | null;
    exp: number | null;
    z: number | null;
  };
  lof: {
    oeLower: number | null;
    oeUpper: number | null;
    oe: number | null;
    obs: number | null;
    exp: number | null;
    z: number | null;
    pLI: number | null;
  };
}
