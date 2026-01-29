import { Component, OnInit, Input } from '@angular/core';
import { take } from 'rxjs/operators';

import { Variant } from './../../../../interfaces/variant';
import { ApiService } from '../../../../services/api.service';
import { DbNSFPData, DBNSFP_METHOD_TO_INFO as METHOD_TO_INFO } from 'src/app/interfaces/data';
import { Animations } from 'src/app/animations';
import { DBNSFP_SCORES_CONFIG, ScoreDisplayConfig } from './dbnsfp-scores-config';

@Component({
  selector: 'app-dbnsfp',
  templateUrl: './dbnsfp.component.html',
  styleUrls: ['./dbnsfp.component.scss'],
  animations: [ Animations.toggleInOut ]
})
export class DbnsfpComponent implements OnInit {
  @Input() variant: Variant;

  loading = false;
  data: DbNSFPData;
  rankAverage: number | null = null;
  scoresToDisplay: ScoreDisplayConfig[];

  constructor(
    private api: ApiService
  ) {
    // Initialize scoresToDisplay with imported config and assign score transforms
    this.scoresToDisplay = DBNSFP_SCORES_CONFIG.map(config => ({
      ...config,
      scoreTransform: this.getScoreTransform(config.toolKey, config.scoreKey)
    }));
  }

  private getScoreTransform(toolKey: string, scoreKey: string): ((value: any, method?: string) => any) | undefined {
    switch (scoreKey) {
      case 'scores':
        return this.max;
      case 'predictions':
        return this.maxStr;
      case 'prediction':
        return this.getPredLabel;
      case 'score':
        if (toolKey === 'GERP++RS') {
          return (score: number) => this.toFixed(score, 3);
        }
        return undefined; // No transform needed for other score types
      default:
        return undefined;
    }
  }

  ngOnInit() {
    this.loading = true;
    this.api.getDbNSFP(this.variant)
      .pipe(take(1))
      .subscribe((res) => {
        this.calcAvgRankscore(res);
        this.data = res;
        this.loading = false;
      });
  }

  calcAvgRankscore(data: DbNSFPData): number | null {
    if (!data || !data.scores) {
      return null;
    }
    let sumRs = 0;
    let numTools = 0;
    for (const tool of this.scoresToDisplay) {
      const rankscore = (data.scores[tool.toolKey] || {})[tool.rankscoreKey || 'rankscore'];
      if (rankscore !== undefined) {
        sumRs += rankscore;
        ++numTools;
      }
    }
    this.rankAverage = numTools > 0 ? sumRs / numTools : null;
    return this.rankAverage;
  }

  max(numArr: (number | null)[]): number | string {
    const filtered = numArr.filter((e) => e !== null);
    if (filtered.length) {
      return Math.max(...filtered);
    }
    return '';
  }

  maxStr(strArr: (string | null)[], method: string): string {
    const weight = METHOD_TO_INFO[method]?.weight;
    if (!weight) {
      return '';
    }
    return METHOD_TO_INFO[method]?.value[
      Math.max(
        ...(strArr.filter((e) => e !== null)
          .map((e) => weight[e]))
      )
    ] || '';
  }

  getPredLabel(str: string, method: string): string {
    const weight = METHOD_TO_INFO[method]?.weight;
    const values = METHOD_TO_INFO[method]?.value;
    return values[weight[str]] || '';
  }

  toFixed(num: number | null, digit: number): string {
    if (num && num.toFixed) {
      return num.toFixed(digit);
    }
    return '';
  }

  hasScoreData(scoreConfig: ScoreDisplayConfig): boolean {
    const toolData = this.data?.scores?.[scoreConfig.toolKey];
    if (!toolData) {
      return false;
    }
    const scoreValue = toolData[scoreConfig.scoreKey];
    return scoreValue !== null && scoreValue !== undefined;
  }

  getDisplayScore(scoreConfig: ScoreDisplayConfig): string {
    const toolData = this.data?.scores?.[scoreConfig.toolKey];
    if (!toolData) {
      return '';
    }

    const scoreValue = toolData[scoreConfig.scoreKey];
    if (scoreValue === null || scoreValue === undefined) {
      return '';
    }

    if (scoreConfig.scoreTransform) {
      return scoreConfig.scoreTransform(scoreValue, scoreConfig.toolKey);
    }

    return scoreValue.toString();
  }

  getRankScore(scoreConfig: ScoreDisplayConfig): number | null {
    const toolData = this.data?.scores?.[scoreConfig.toolKey];
    if (!toolData) {
      return null;
    }

    const rankscoreKey = scoreConfig.rankscoreKey || 'rankscore';
    return toolData[rankscoreKey];
  }
}
