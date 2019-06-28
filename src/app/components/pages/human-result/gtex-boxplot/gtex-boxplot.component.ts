import { Component, OnInit, Input } from '@angular/core';
import { take } from 'rxjs/operators';

import { ApiService } from 'src/app/services/api.service';

import { HumanGene } from 'src/app/interfaces/gene';
import { Point } from 'src/app/d3/interfaces';
import { GroupedBoxplot } from 'src/app/d3/grouped-boxplot';

@Component({
  selector: 'app-gtex-boxplot',
  templateUrl: './gtex-boxplot.component.html',
  styleUrls: ['./gtex-boxplot.component.scss']
})
export class GtexBoxplotComponent implements OnInit {
  @Input() gene: HumanGene;
  points: Point[];

  boxplot: GroupedBoxplot;
  width = 1024;
  height = 480;

  organs;
  organLabelColors;
  organVisibility = [];

  constructor(
    private api: ApiService
  ) { }

  ngOnInit() {
    this.api.getGtexByEntrezId(this.gene.entrezId)
      .pipe(take(1))
      .subscribe(res => {
        console.log(' > gtex:', res);
        this.points = this.parseData(res['data']);
        this.boxplot = new GroupedBoxplot(this.points,
          {
            width: this.width, height: this.height,
            x: { label: 'Tissues', },
            y: { label: 'TPM' }
          }
        );

        this.organLabelColors = [];
        this.organVisibility = [];
        for (const organ of this.organs) {
          this.organLabelColors.push(this.boxplot.getGroupColor(organ));
          this.organVisibility.push(true);
        }
      });
  }

  toggleOrgan(organIdx) {
    this.boxplot.toggleGroup(this.organs[organIdx]);
    this.organVisibility[organIdx] = !this.organVisibility[organIdx];
  }

  parseData(data) {
    const formatted = [];

    const organs = Object.keys(data);
    this.organs = organs;
    for (const organName of organs) {
      const tissues = Object.keys(data[organName]);
      for (const tissueName of tissues) {
        for (const value of data[organName][tissueName]) {
          formatted.push({
            x: tissueName,
            y: value,
            group: organName
          });
        }
      }
    }
    return formatted;
  }

}
