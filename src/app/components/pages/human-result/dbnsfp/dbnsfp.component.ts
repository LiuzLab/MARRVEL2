import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-dbnsfp',
  templateUrl: './dbnsfp.component.html',
  styleUrls: ['./dbnsfp.component.scss']
})
export class DbnsfpComponent implements OnInit {
  @Input() data: DbNSFPData;

  constructor() { }

  ngOnInit() {
  }

}

interface MethodScore {
  rawScore?: number;
  score?: number;
  phred?: number;
  prediction?: string;
  rankscore?: number;
  convertedRankscore?: number;
}
interface DbNSFPData {
  hg19Chr: string;
  hg19Pos: number;
  ref: string;
  alt: string;
  scores: {
    CADD?: MethodScore;
    REVEL?: MethodScore;
    MCAP?: MethodScore;
    Polyphen2HDIV?: MethodScore;
    Polyphen2HVAR?: MethodScore;
    'GERP++RS'?: MethodScore;
    phyloP100wayVertebrate?: MethodScore;
    phyloP30wayMammalian?: MethodScore;
  };
}