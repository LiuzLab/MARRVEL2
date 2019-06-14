import * as d3 from 'd3';

import { Point, BoxConfig } from './interfaces';

export class GroupedBoxplot {
  public data: Point[];
  public svg;

  private options: BoxConfig;
  private width: number;
  private height: number;

  private yMin: number;
  private yMax: number;
  private yScale;
  private tooltipDiv;

  private groupedData;
  private groupNames;
  private groupNameToIdx;
  private totalBoxes;
  private totalBoxesVisible;
  private groupColorScale;
  private groupHidden;

  constructor(data: Point[], options?: BoxConfig) {
    options = options || { width: 1024, height: 500 };
    options.margin = options.margin || {};
    options.margin.l = options.margin.l || 50;
    options.margin.r = options.margin.r || 30;
    options.margin.t = options.margin.t || 30;
    options.margin.b = options.margin.b || 120;
    this.options = options;

    this.width = options.width || 1024;
    this.height = options.height || 480;

    this.data = data;

    const svg = d3.select('svg');
    this.svg = svg;

    this.groupHidden = {};

    // group data
    this.groupData(data);

    // set color scale for groups
    this.groupColorScale = this.initColorScale(this.groupNames);

    // set boxes according to x values
    this.totalBoxes = 0;   // count the total number of boxes
    for (const G of this.groupedData) {
      G.boxes = this.initBoxes(G.data);
      this.totalBoxes += G.boxes.length;
      delete G.data;
    }
    this.totalBoxesVisible = this.totalBoxes;
    console.log(this.groupedData);

    // set x scale for each group
    this.initXScale(this.groupedData, this.totalBoxes);

    // put x axis label
    if (this.options.x && this.options.x.label) {
      this.svg.append('g').append('text')
        .attr('transform', `translate(${this.width / 2}, ${this.height - 2})`)
        .attr('text-anchor', 'middle')
        .attr('font-size', '10pt')
        .text(this.options.x.label);
    }
    // set y scale
    this.initYScaleAndDrawYAxis();
    // put y axis label
    if (this.options.y.label) {
      this.svg.append('g').append('text')
        .attr('text-anchor', 'middle')
        .attr('font-size', '10pt')
        .attr('transform', `translate(10, ${this.height / 2}) rotate(-90) `)
        .style('font', '12px sans-serif')
        .style('color', '#000')
        .text(this.options.y.label);
    }

    // Set div to show tooltip
    this.tooltipDiv = this.initTooltipDiv();

    // Draw boxes per group
    for (const G of this.groupedData) {
      this.initGroupVisual(G, svg, this.yScale, this.groupColorScale(G.name), this.tooltipDiv);
    }
  }

  public toggleGroup(groupName) {
    if (!(groupName in this.groupHidden)) {
      this.groupHidden[groupName] = false;
    }
    this.groupHidden[groupName] = !this.groupHidden[groupName];

    const currentNoBox = this.groupedData[this.groupNameToIdx[groupName]].boxes.length;
    this.totalBoxesVisible += this.groupHidden[groupName] ? -currentNoBox : currentNoBox;

    // set x scale for each group
    this.initXScale(this.groupedData, this.totalBoxesVisible);
    this.initYScaleAndDrawYAxis();

    this.svg.selectAll('.xaxis').remove();
    // Draw boxes per group
    for (const G of this.groupedData) {
      this.initGroupVisual(G, this.svg, this.yScale, this.groupColorScale(G.name), this.tooltipDiv);
    }
  }

  groupData(data) {
    this.groupedData = [];
    this.groupNames = [];
    this.groupNameToIdx = {};
    for (const P of data) {
      if (!(P.group in this.groupNameToIdx)) {
        this.groupNameToIdx[P.group] = this.groupedData.length;
        this.groupedData.push({
          name: P.group,
          number: this.groupNameToIdx[P.group],
          data: []
        });
        this.groupNames.push(P.group);
      }
      this.groupedData[this.groupNameToIdx[P.group]].data.push(P);
    }
  }

  initColorScale(groupValues) {
    // Mix the group values so that consecutive groups will not have similar color
    for (let i = (groupValues.length / 2) % 2 !== 0 ? 0 : 1; i < groupValues.length / 2; i += 2) {
      const idx2 = groupValues.length / 2 + i;
      groupValues[idx2] = [
        groupValues[i],
        groupValues[i] = groupValues[idx2]
      ][0];
    }
    // Set range
    const colorRange = groupValues.map((v, i, arr) => d3.interpolateSpectral(i / (arr.length - 1)));
    return d3.scaleOrdinal().domain(groupValues).range(colorRange);
  }

  initYScaleAndDrawYAxis() {
    // Calculate yMin and yMax among visible groups
    this.yMin = 1000000000, this.yMax = -1000000000;
    for (const G of this.groupedData) {
      if (G.name in this.groupHidden && this.groupHidden[G.name]) continue;

      for (const box of G.boxes) {
        for (const yVal of box.y) {
          this.yMin = Math.min(this.yMin, yVal);
          this.yMax = Math.max(this.yMax, yVal);
        }
      }
    }

    const yScale = d3.scaleLinear()
      .domain([ this.yMin, this.yMax ]).nice()
      .range([ this.height - this.options.margin.b, this.options.margin.t ]);
    // draw y axis
    this.svg.selectAll('.yaxis').remove();
    const yAxis = g => g
      .attr('transform', `translate(${this.options.margin.l - 2},0)`)
      .attr('class', 'yaxis')
      .call(d3.axisLeft(yScale).ticks(null, 's'))
      .call(g => g.select('.domain').remove());
    this.svg.append('g').call(yAxis);
    this.yScale = yScale;
  }

  initTooltipDiv() {
    return d3.select('body')
      .append('div')
      .attr('class', 'plot-tooltip')
      .style('opacity', 0)
      .style('position', 'absolute')
      .style('width', 'auto')
      .style('height', 'auto')
      .style('padding', '0.5em')
      .style('font', '12px sans-serif')
      .style('color', '#fff')
      .style('background', 'rgba(0,0,0,0.5)')
      .style('border', '0px')
      .style('border-radius', '2px')
      .style('pointer-events', 'none')
    ;
  }

  calcGroupWidth() {
    const plotAreaWidth = this.width - this.options.margin.l - this.options.margin.r;
    let lastRangeEnds = this.options.margin.l;
    for (const G of this.groupedData) {
      if (G.name in this.groupHidden && this.groupHidden[G.name]) continue;

      const W = plotAreaWidth * G.boxes.length / this.totalBoxesVisible;
      G.widthRange = [ lastRangeEnds, lastRangeEnds + W ];
      lastRangeEnds += W;
    }

  }

  initXScale(groups, totalBoxes) {
    this.calcGroupWidth();
    for (const G of groups) {
      for (const box of G.boxes) {
        box.y.sort((a, b) => a - b);
        const min = box.y[0];
        const max = box.y[box.y.length - 1];
        const q1 = d3.quantile(box.y, 0.25);
        const q2 = d3.quantile(box.y, 0.50);
        const q3 = d3.quantile(box.y, 0.75);
        const iqr = q3 - q1;
        const r0 = Math.max(min, q1 - iqr * 1.5);
        const r1 = Math.min(max, q3 + iqr * 1.5);
        box.quartiles = [ q1, q2, q3 ];
        box.range = [ r0, r1 ];
        box.outliers = box.y.filter(v => v < r0 || v > r1);
      }
    }
  }

  initGroupVisual(group, svg, y, groupColor, div) {
    svg.selectAll(`.group-${group.number}`).remove();
    if (group.name in this.groupHidden && this.groupHidden[group.name]) {
      return;
    }

    const x = d3.scaleBand()
        .domain(group.boxes.map(d => d.x))
        .range([ group.widthRange[0], group.widthRange[1] ])
        .paddingOuter(0)
        .paddingInner(0);
    const dist = x.step() - 1;

    const g = svg.append('g')
      .attr('class', `group-${group.number}`)
      .selectAll('g')
      .data(group.boxes)
      .join('g');

    // draw ~q1, q3~ as line
    g.append('path')
      .attr('stroke', 'currentColor')
      .attr('d', d => {
        return `M${x(d.x) + dist / 2},${y(d.range[1])} ` + `V${y(d.range[0])}`;
      });

    // draw q1~q3 as box
    g.append('path')
      .attr('fill', groupColor)
      .attr('d', d =>
        `M${x(d.x)},${y(d.quartiles[2])} ` +
        `H${x(d.x) + dist} ` +
        `V${y(d.quartiles[0])} ` +
        `H${x(d.x)} Z`
      )
      .on('mouseover', d => {
        div.transition()
          .duration(200)
          .style('opacity', .9);
        div.html(`<strong>Organ</strong>: ${group.name}<br>
                  <strong>Tissue</strong>: ${d.x}<br>
                  <strong>#Samples</strong>: ${d.y.length}<br>
                  <strong>Median</strong>: ${d['quartiles'][1].toFixed(3)}`)
          .style('left', d3.event.pageX + 'px')
          .style('top', (d3.event.pageY - 28) + 'px')
        ;
      })
      .on('mouseout', d => {
        div.transition()
          .duration(500)
          .style('opacity', 0);
      })
    ;

    // draw q2 as thick line inside the box
    g.append('path')
      .attr('stroke', 'currentColor')
      .attr('stroke-width', 2)
      .attr('d', d =>
        `M${x(d.x)},${y(d.quartiles[1])}
        H${x(d.x) + dist}`
      );

    g.append('g')
      .attr('fill', 'currentColor')
      .attr('fill-opacity', 0.2)
      .attr('stroke', 'none')
      .attr('transform', d => `translate(${x(d.x) + dist / 2},0)`)
      .selectAll('circle')
      .data(d => d['outliers'])
        .join('circle')
          .attr('r', 2)
          // .attr('cx', () => (Math.random() - 0.5) * 4)
          .attr('cy', d => y(d))
    ;

    const xAxisFontSize = 10;
    const xAxisLabelLimit = Math.ceil((this.options.margin.b - 12) * 2 / xAxisFontSize * 1.25);
    const xAxis = g => g
      .attr('transform', `translate(0,${this.height - this.options.margin.b})`)
      .call(d3.axisBottom(x).ticks(group.boxes.map(b => b.x)).tickSizeOuter(0));
    svg.append('g').attr('class', 'xaxis').call(xAxis)
      .selectAll('text')
        .attr('transform', 'rotate(30)')
        .attr('text-size', `${xAxisFontSize}px`)
        .style('text-anchor', 'start')
        .text(text => {
          return text.length < xAxisLabelLimit ? text : text.substr(0, xAxisLabelLimit) + ' ...';
        })
        .on('mouseover', text => {
          div.transition()
            .duration(200)
            .style('opacity', .9);
          div.html(text)
            .style('left', d3.event.pageX + 'px')
            .style('top', (d3.event.pageY - 28) + 'px');
        })
        .on('mouseout', text => {
          div.transition()
            .duration(500)
            .style('opacity', 0);
        })
    ;

  }

  initBoxes(data) {
    const boxes = [];
    const xValToBoxNum = {};
    for (const P of data) {
      if (!(P.x in xValToBoxNum)) {
        xValToBoxNum[P.x] = boxes.length;
        boxes.push({
          x: P.x,
          number: xValToBoxNum[P.x],
          y: []
        });
      }
      boxes[xValToBoxNum[P.x]].y.push(P.y);
    }
    return boxes;
  }

  public getGroupColor(groupName: string): string {
    return this.groupColorScale(groupName);
  }
}
