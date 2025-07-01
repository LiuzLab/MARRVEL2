import * as d3 from 'd3';
import { ProteinDomain } from '../interfaces/data';
import { PDConfig } from './interfaces/protein-domain-plot';

// Save colors to use (to minize #color used)
const COLORS = {
  'A1': 'rgba(0,0,0,0.1)',
  'intron-phase-0': '#000000',
  'intron-phase-1': '#0000ff',
  'intron-phase-2': '#ff0000',
  'intron-phase-3': '#00ff00',
  'intrinsic-SEG': '#FF00FF',
  'intrinsic-COIL': '#00FF00',
  'intrinsic-TRANS': '#0000FF',
};

export class ProteinDomainPlot {
  data: ProteinDomain[];
  svg;
  options: PDConfig;
  elementId: string;

  scale;
  // View scale control
  xViewScale = 1;
  viewWMax: number;
  wrapperDX: number;
  // Fixed to option variables
  daHeight: number;   // Draw area height
  yMiddle: number;

  constructor(elementId: string, data: ProteinDomain[], options?) {
    this.elementId = elementId;
    this.data = data;
    // Set default options
    this.options = options || {};
    this.options.width = this.options.width || 1500;
    this.options.height = this.options.height || 100;

    this.options.margin = this.options.margin || {};
    this.options.margin.t = this.options.margin.t || 5;
    this.options.margin.r = this.options.margin.r || 25;
    this.options.margin.b = this.options.margin.b || 20;
    this.options.margin.l = this.options.margin.l || 5;

    this.options.bgColor = this.options.bgColor || 'transparent';

    this.options.lowCompHeight = this.options.lowCompHeight || 6;

    // init graphic
    this.init();
  }

  public xScale(ratio?: number): number {
    if (ratio === undefined) {
      return this.xViewScale;
    }

    this.setViewScale(ratio);
    if (this.viewWMax <= this.options.width) {   // If the plot length got shorter than view width, reset dragged offset
      this.wrapperDX = 0;
    } else {
      // Don't go further than right end
      this.wrapperDX = Math.max(this.wrapperDX, -this.viewWMax + this.options.width - this.options.margin.r);
    }
    this.draw();
    return this.xViewScale;
  }

  public reset() {
    this.wrapperDX = 0;
    this.xScale(0);
  }

  init() {
    this.svg = d3.select(`#${this.elementId}`);
    this.svg.attr('width', this.options.width);
    this.svg.attr('height', this.options.height);

    // Calc frequently used values
    this.daHeight = this.options.height - this.options.margin.t - this.options.margin.b;
    this.yMiddle = this.options.margin.t + this.daHeight / 2;

    this.wrapperDX = 0;

    this.setViewScale();
    this.draw();
  }

  setViewScale(ratio?: number) {
    this.xViewScale = ratio || 1;
    // Calc view max
    const posMax = Math.ceil(d3.max(this.data.map((d) => d.end != null ? d.end : d.start)) / 100) * 100;    // Round from 100
    this.viewWMax = posMax * this.xViewScale;
    // Set scale
    this.scale = d3.scaleLinear()
      .domain([ 0, posMax ])
      .range([ this.options.margin.l, this.viewWMax ]);
  }

  draw() {
    if (!this.scale) {
      this.setViewScale();
    }

    this.svg.selectAll('*').remove();

    // create wrapper
    const wrapper = this.svg.append('g')
      .attr('id', `${this.elementId}-wrapper`)
      .attr('transform', `translate(${this.wrapperDX},0)`);
    if (this.viewWMax > this.options.width) {
      // Add drag behavior
      wrapper.call(d3.drag()
        .on('drag', (data, idx, group) => {
          this.wrapperDX = Math.max(
            Math.min(0, this.wrapperDX + d3.event.dx),    // Don't go further than left end
            -this.viewWMax + this.options.width - this.options.margin.r   // Don't go further than right end
          );
          d3.select(group[0]).attr('transform', `translate(${this.wrapperDX},0)`);
        }));
      document.getElementById(this.elementId).style.cursor = 'grab';   // Change cursor to indicate the plot is moveable
    } else {
      document.getElementById(this.elementId).style.cursor = 'initial';   // Change cursor to indicate the plot is moveable
    }
    // Draw background
    wrapper.append('rect')
      .attr('width', this.viewWMax + this.options.margin.l + this.options.margin.r)
      .attr('height', this.options.height)
      .attr('fill', this.options.bgColor)
      .attr('stroke-width', 0);

    // Draw axis
    wrapper.selectAll('.axis').remove();
    const axis = (g) => g
      .attr('transform', `translate(${this.options.margin.l},${this.options.height - this.options.margin.b})`)
      .attr('class', 'axis')
      .call(d3.axisBottom(this.scale).ticks(Math.ceil((this.scale.domain()[1] - this.scale.domain()[0]) / 100) + 1))
      .call((gr) => gr.select('.domain').remove());
    wrapper.append('g').call(axis);
    // Draw middle horizontal line
    wrapper.append('g')
      .append('line')
        .attr('stroke', COLORS['A1'])
        .attr('stroke-width', 2)
        .attr('x1', this.scale.range()[0])
        .attr('x2', this.scale.range()[1])
        .attr('y1', this.yMiddle)
        .attr('y2', this.yMiddle);

    const domainGr = wrapper.append('g');
    const intronGr = wrapper.append('g');
    for (const dom of this.data) {
      switch (dom.type) {
        case 'INTRON':
          intronGr.call(this.drawIntron(dom.start, dom.phase));
          break;
        case 'INTRINSIC':
          switch (dom.name) {
            case 'TRANS':
              domainGr.call(this.drawLC(dom, this.options.margin.t, this.daHeight));
              break;
            default:
              domainGr.call(this.drawLC(dom));
          }
          break;
        case 'SMART':
          switch ((dom.shape || {}).shape) {
            case 'rect':
              domainGr.call(this.drawRectDom(dom));
              break;
            case 'rect_r':
              domainGr.call(this.drawRectDom(dom, 8, 8));
              break;
            case 'elli':
              domainGr.call(this.drawRectDom(dom, (this.scale(dom.end) - this.scale(dom.start)) / 2, this.daHeight / 2));
              break;
            case 'tri_l':
            case 'tri_r':
            case 'dia':
            case 'pent_u':
            case 'pent_d':
            case 'hex_h':
            case 'hex_v':
            case 'oct':
              domainGr.call(this.drawPath(dom.shape.shape, dom));
              break;
          }
          break;
        default:
          break;
      }
    }
  }

  drawIntron(pos, phase) {
    return (g) => g.append('line')
      .attr('stroke', COLORS[`intron-phase-${phase}`])
      .attr('stroke-width', 0.75)
      .attr('x1', this.scale(pos))
      .attr('x2', this.scale(pos))
      .attr('y1', this.options.margin.t)
      .attr('y2', this.options.margin.t + this.daHeight)
      .attr('opacity', 0.9);
  }

  drawLC(dom: ProteinDomain, y?: number, height?: number) {
    return (g) => g.append('rect')
      .attr('x', this.scale(dom.start))
      .attr('y', y || (this.yMiddle - this.options.lowCompHeight / 2))
      .attr('width', this.scale(dom.end) - this.scale(dom.start))
      .attr('height', height || this.options.lowCompHeight)
      .attr('fill', COLORS[`intrinsic-${dom.name}`])
      .attr('opacity', 0.9);
  }

  drawRectDom(dom: ProteinDomain, rx?: number, ry?: number) {
    return (g) => {
      const gr = g.append('g')
        .attr('transform', `translate(${this.scale(dom.start)},${this.options.margin.t})`);
      gr.append('rect')
        .attr('width', this.scale(dom.end) - this.scale(dom.start))
        .attr('height', this.daHeight)
        .attr('stroke-width', 0)
        .attr('rx', rx || 0)
        .attr('ry', ry || 0)
        .attr('fill', dom.shape.fill)
        .attr('opacity', 0.9);
      if (!this.options.hideDomainLabel) {
        gr.append('text')
          .attr('transform', `translate(${(this.scale(dom.end) - this.scale(dom.start)) / 2 - 5}, ${this.daHeight / 2}) rotate(90)`)
          .attr('text-anchor', 'middle')
          .attr('fill', dom.shape.textColor)
          .attr('font-size', '14px')
          .attr('font-weight', 400)
          .text(dom.name);
      }
      return g;
    };
  }

  getPathTransform(shapeName: string, dom: ProteinDomain): string {
    const domWidth = this.scale(dom.end) - this.scale(dom.start);
    const ratio = 1 / this.daHeight * domWidth;
    switch (shapeName) {
      case 'pent_u':
        return `matrix(${ratio},0,0,1.105572809,0,0)`;    // 2/(1+cos(36deg))
      case 'pent_d':
        return `matrix(${ratio},0,0,1.105572809,0,${-0.211145618 * this.daHeight / 2})`;    // 2/(1+cos(36deg))*(1-cos(36deg))
      case 'hex_h':
        return `matrix(${ratio},0,0,1.15470053838,0,${-0.15470053837 * this.daHeight / 2})`;
      case 'hex_v':
        return `matrix(${domWidth / Math.sqrt(3) / this.daHeight * 2},0,0,1,0,0)`;
      case 'oct':
        return `matrix(${domWidth / ((2 + 2 * Math.sqrt(2)) * Math.tan(Math.PI / 8)) / this.daHeight * 2},0,0,1,0,0)`;
    }
    return '';
  }
  getTxtX(shapeName: string, dom: ProteinDomain): number {
    const domWidth = this.scale(dom.end) - this.scale(dom.start);
    const dx = -5;    // A little adjust due to font height?
    switch (shapeName) {
      case 'tri_l':
        return domWidth / 3 * 2 + dx;
      case 'tri_r':
        return domWidth / 3 + dx;
      default:
        return domWidth / 2 + dx;
    }
  }
  getTxtY(shapeName: string, dom: ProteinDomain): number {
    switch (shapeName) {
      case 'pent_u':
        return this.daHeight * 0.5527864045;   // 1 / (1 + cos(36deg))
      case 'pent_d':
        return this.daHeight * 0.4472135955;   // cos(36deg) / (1 + cos(36deg))
      default:
        return this.daHeight / 2;
    }
  }
  getPathCmd(shapeName: string, dom: ProteinDomain): string {
    const domWidth = this.scale(dom.end) - this.scale(dom.start);
    const rad = this.daHeight / 2;
    const sin18deg = 0.30901699437, cos18deg = 0.95105651629, sin54deg = 0.80901699437, cos54deg = 0.58778525229;
    const sin60deg = 0.86602540378;
    const tan225deg = Math.tan(Math.PI / 8), sqrt2 = Math.sqrt(2);
    switch (shapeName) {
      case 'tri_l':
        return `M${domWidth},0 V${this.daHeight} L0,${this.daHeight / 2} L${domWidth},0`;
      case 'tri_r':
        return `M0,0 V${this.daHeight} L${domWidth},${this.daHeight / 2} L0,0`;
      case 'dia':
        return `M0,${this.daHeight / 2} L${domWidth / 2},0 L${domWidth},${this.daHeight / 2}
          L${domWidth / 2},${this.daHeight} L0,${this.daHeight / 2}`;
      case 'pent_u':
        return `M${rad},0 L${rad * cos18deg + rad},${-rad * sin18deg + rad}
          L${rad * cos54deg + rad},${rad * sin54deg + rad}
          L${-rad * cos54deg + rad},${rad * sin54deg + rad} L${-rad * cos18deg + rad},${-rad * sin18deg + rad}
          L${rad},0`;
      case 'pent_d':
        return `M${rad},${this.daHeight} L${rad * cos18deg + rad},${rad * sin18deg + rad}
          L${rad * cos54deg + rad},${-rad * sin54deg + rad}
          L${-rad * cos54deg + rad},${-rad * sin54deg + rad}
          L${-rad * cos18deg + rad},${rad * sin18deg + rad} L${rad},${this.daHeight}`;
      case 'hex_h':
        return `M${this.daHeight},${rad} L${rad * 1.5},${(1 + sin60deg) * rad} L${0.5 * rad},${(1 + sin60deg) * rad}
          L0,${rad} L${0.5 * rad},${0.13397459621 * rad} L${1.5 * rad},${0.13397459621 * rad} L${this.daHeight},${rad}`;
      case 'hex_v':
        return `M0,${1.5 * rad} L${sin60deg * rad},${this.daHeight} L${2 * sin60deg * rad},${1.5 * rad} L${2 * sin60deg * rad},${0.5 * rad}
          L${sin60deg * rad},0 L0,${0.5 * rad} L0,${1.5 * rad}`;
      case 'oct':
        return `M${sqrt2 * tan225deg * rad},0
          L${(2 + sqrt2) * tan225deg * rad},0
          L${(2 + 2 * sqrt2) * tan225deg * rad},${sqrt2 * tan225deg * rad}
          L${(2 + 2 * sqrt2) * tan225deg * rad},${(sqrt2 + 2) * tan225deg * rad}
          L${(2 + sqrt2) * tan225deg * rad},${(sqrt2 * 2 + 2) * tan225deg * rad}
          L${sqrt2 * tan225deg * rad},${(sqrt2 * 2 + 2) * tan225deg * rad}
          L0,${(sqrt2 + 2) * tan225deg * rad}
          L0,${sqrt2 * tan225deg * rad}
          L${sqrt2 * tan225deg * rad},0`;
    }
    return '';
  }
  drawPath(shapeName: string, dom: ProteinDomain) {
    return (g) => {
      const gr = g.append('g')
        .attr('transform', `translate(${this.scale(dom.start)},${this.options.margin.t})`);
      gr.append('path')
        .attr('d', this.getPathCmd(shapeName, dom))
        .attr('stroke-width', 0)
        .attr('fill', dom.shape.fill)
        .attr('transform', this.getPathTransform(shapeName, dom))
        .attr('opacity', 0.9);
      if (!this.options.hideDomainLabel) {
        gr.append('text')
          .attr('transform', `translate(${this.getTxtX(shapeName, dom)}, ${this.getTxtY(shapeName, dom)}) rotate(90)`)
          .attr('text-anchor', 'middle')
          .attr('fill', dom.shape.textColor)
          .attr('font-size', '14px')
          .attr('font-weight', 400)
          .text(dom.name);
        return g;
      }
    };
  }
}

