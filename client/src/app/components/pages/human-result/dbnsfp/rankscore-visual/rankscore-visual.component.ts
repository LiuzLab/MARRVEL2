import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-rankscore-visual',
  templateUrl: './rankscore-visual.component.html',
  styleUrls: ['./rankscore-visual.component.scss']
})
export class RankscoreVisualComponent implements OnInit {
  @Input() rankscore: number;

  constructor() { }

  ngOnInit() {
  }

  getColor(score: number) {
    // 255, 71, 71
    // 71, 198, 255
    return `rgb(${Math.floor(184 * score + 71)},${Math.floor(198 - 127 * score)},${Math.floor(255 - 184 * score)})`;
  }

}
