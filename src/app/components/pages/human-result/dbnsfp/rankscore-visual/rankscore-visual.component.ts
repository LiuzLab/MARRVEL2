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

}
