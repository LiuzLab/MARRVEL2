import { Component, OnChanges, Input, SimpleChanges } from '@angular/core';

import { CAT_TO_ICON } from '../../../../../category';

@Component({
  selector: 'app-geno2mp-phenotype-pictogram',
  templateUrl: './geno2mp-phenotype-pictogram.component.html',
  styleUrls: ['./geno2mp-phenotype-pictogram.component.scss']
})
export class Geno2mpPhenotypePictogramComponent implements OnChanges {
  categories = Object.keys(CAT_TO_ICON);
  catToIcon = CAT_TO_ICON;

  @Input() categoryStatus: object = {};

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
  }

}
