import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MatSliderChange } from '@angular/material/slider';

import cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';
cytoscape.use(dagre);

import { HumanGene } from '../../../../interfaces/gene';
import { NODE_CONFIG, EDGE_CONFIG } from './config';
import { Animations } from '../../../../animations';

const PRIMARY_COLOR = '#7bd0cc';
const WARN_COLOR = '#e5893e';

@Component({
  selector: 'app-ppi',
  templateUrl: './ppi.component.html',
  styleUrls: ['./ppi.component.scss'],
  animations: [
    trigger('slideInOut', [
      state('true', style({
        width: '300px'
      })),
      state('false', style({
        overflow: 'hidden',
        width: '0px',
        padding: 0
      })),
      transition('in => out', animate('400ms ease-in-out')),
      transition('out => in', animate('400ms ease-in-out'))
    ]),
    trigger('slideVInOut', [
      state('true', style({
        height: 'auto'
      })),
      state('false', style({
        overflow: 'hidden',
        height: '0px',
        padding: 0
      })),
      transition('in => out', animate('400ms ease-in-out')),
      transition('out => in', animate('400ms ease-in-out'))
    ])
  ],
})
export class PpiComponent implements OnInit, AfterViewInit {
  @Input() gene: HumanGene;
  @Input() data;
  cy: any;

  evidences;
  evidenceRange;
  eviMin;
  eviMax;
  eviThreshold = 5;

  ppiEvidences;
  selectedGene1: string;
  selectedGene2: string;

  legendOpened = true;
  controlOpened = true;
  popupContainerStyle = {};

  constructor() { }

  ngOnInit(): void {
    this.evidenceRange = Array.from(new Set(this.data.map((x) => x.evidences?.length || 0)))
      .filter((val: number) => val > 0)
      .sort((a: number, b: number) => a - b);
    this.eviMin = this.evidenceRange[0];
    this.eviMax = this.evidenceRange[this.evidenceRange.length - 1];
    this.eviThreshold = this.evidenceRange[Math.floor(this.evidenceRange.length / 2)];
  }

  ngAfterViewInit(): void {
    this.cy = cytoscape({
      container: document.getElementById('ppiCyGraph'),
      elements: [],
      style: [{ selector: 'node', style: { label: 'data(name)' } }],
      zoomingEnabled: true,
      userZoomingEnabled: false,
    });

    this.updateGraph();
    this.runLayout();
  }

  onThresholdChange(value): void {
    if (value > this.eviMax) {
      value = this.eviMax;
    }
    this.eviThreshold = value;
    this.updateGraph();
    this.runLayout();
  }

  updateGraph() {
    // Remove all
    this.cy.remove('edge');
    this.cy.remove('node');

    if (!this.cy.getElementById(this.gene.symbol).isNode()) {
      // adding present gene
      this.cy.add([{
        group: 'nodes',
        style: {
          ...NODE_CONFIG,
          color: PRIMARY_COLOR
        },
        data: { id: this.gene.symbol, name: this.gene.symbol }
      }]);
    }

    for (const edge of this.data) {
      if (!edge.evidences?.length) {
        continue;
      }
      // Skip self edge
      if (edge.interactor.symbol === this.gene.symbol) {
        continue;
      }
      const edgeId = `${this.gene.symbol}||${edge.interactor.symbol}`;
      if (edge.evidences?.length >= this.eviThreshold) {
        this.addEdge(edge);
      }
    }
    for (const edge of this.data) {
      if (edge.interactor.symbol === this.gene.symbol ||
        edge.evidences?.length < this.eviThreshold ||
        !edge.interactor.ppis?.length) {
        continue;
      }
      for (const interactorEdge of edge.interactor.ppis) {
        // Skip self edge
        if (interactorEdge.interactor.entrezId === interactorEdge.source.entrezId) {
          continue;
        }
        // Skip back edge (just added)
        if (interactorEdge.interactor.entrezId === edge.source.entrezId) {
          continue;
        }
        if (interactorEdge.evidences?.length >= this.eviThreshold &&
          this.cy.getElementById(interactorEdge.interactor.symbol).isNode()) {
          this.addEdge(interactorEdge);
        }
      }
    }
    this.cy.$('edge').on('tap', (e) => {
      const S = e.target.id().split('||');
      this.showPPITable(e.target);
    });
  }

  addEdge(edge): void {
    const edgeId = `${edge.source.symbol}||${edge.interactor.symbol}`;
    this.getNodeByIdOrAdd(edge.interactor.symbol,
      { id: edge.interactor.symbol, name: edge.interactor.symbol });
    this.getEdgeByIdOrAdd(edgeId, {
      id: edgeId,
      source: edge.source.symbol,
      target: edge.interactor.symbol,
      evidences: edge.evidences,
      weight: edge.evidences.length,
      opacity: 0.4 + 0.6 * edge.evidences.length / this.eviMax
    });
  }

  getNodeByIdOrAdd(id: string, nodeData: object) {
    const gotById = this.cy.getElementById(id);
    if (gotById.isNode()) {
      return gotById;
    }
    return this.cy.add([{
      group: 'nodes',
      style: {
        ...NODE_CONFIG,
      },
      data: nodeData
    }]);
  }

  getEdgeByIdOrAdd(id: string, edgeData: object) {
    const gotById = this.cy.getElementById(id);
    if (gotById.isEdge()) {
      return gotById;
    }
    return this.cy.add([{
      group: 'edges',
      style: {
        ...EDGE_CONFIG,
        opacity: edgeData['weight'] ? (edgeData['weight'] / this.evidenceRange[this.evidenceRange.length - 1]) : 1
      },
      data: edgeData
    }]);
  }

  runLayout() {
    const layoutppi = this.cy.layout({
      name: 'concentric',
      concentric(node) {
        return node.degree();
      },
      levelWidth(nodes) {
        return 2;
      }
    });
    layoutppi.run();
  }

  zoomGraph(opt) {
    if (opt === 'plus') {
      this.cy.zoom(this.cy.zoom() + 0.02);
    } else if (opt === 'minus') {
      this.cy.zoom(this.cy.zoom() - 0.02);
    }
  }

  changePPIEdgeColor(edgeId, color) {
    const edge = this.cy.getElementById(edgeId);
    if (edge.isEdge()) {
      edge.style('line-color', color);
    }
  }

  showPPITable(edge) {
    const genes = edge.id().split('||');
    if (this.selectedGene1 !== genes[0] || this.selectedGene2 !== genes[1]) {
      this.changePPIEdgeColor(`${this.selectedGene1}||${this.selectedGene2}`, PRIMARY_COLOR);
    }
    this.selectedGene1 = genes[0];
    this.selectedGene2 = genes[1];
    this.ppiEvidences = edge.data().evidences;
    edge.style('line-color', WARN_COLOR);
  }

  closePPIDetail() {
    this.changePPIEdgeColor(`${this.selectedGene1}||${this.selectedGene2}`, PRIMARY_COLOR);
    this.selectedGene1 = undefined;
    this.selectedGene2 = undefined;
    this.ppiEvidences = undefined;
  }
}
