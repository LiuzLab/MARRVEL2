import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

import cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';
cytoscape.use(dagre);

import { HumanGene } from '../../../../../interfaces/gene';
import { NODE_CONFIG, EDGE_CONFIG } from '../config';

const PRIMARY_COLOR = '#7bd0cc';
const WARN_COLOR = '#e5893e';

@Component({
  selector: 'app-ppi-visual',
  templateUrl: './ppi-visual.component.html',
  styleUrls: ['./ppi-visual.component.scss'],
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
export class PpiVisualComponent implements OnInit, AfterViewInit {
  @Input() gene: HumanGene;
  @Input() type: 'string' | 'curated' = 'string';
  @Input() data;
  cy: any;

  // Variables for STRING data
  //  - Thresholds
  expMin: number;
  expMax: number
  expThreshold = 1;
  dbMin: number;
  dbMax: number;
  dbThreshold = 1;
  //  - Protein ID to gene symbol mapping
  proteinIdToSymbol: { [key: string]: string } = {};
  // Evidence related variables for curated data
  evidences;
  evidenceRange;
  eviMin: number;
  eviMax: number;
  eviThreshold = 5;

  ppiEvidences;
  selectedGene1: string;
  selectedGene2: string;

  legendOpened = true;
  controlOpened = true;
  popupContainerStyle = {};

  constructor() { }

  ngOnInit(): void {
    // Initialize evidence/score thresholds
    if (this.type === 'curated') {
      this.initCuratedThresVars();
    } else {
      this.initStringVars();
    }
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

  initCuratedThresVars(): void {
    this.evidenceRange = Array.from(new Set(this.data.map((x) => x.evidences?.length || 0)))
      .filter((val: number) => val > 0)
      .sort((a: number, b: number) => a - b);
    this.eviMin = this.evidenceRange[0];
    this.eviMax = this.evidenceRange[this.evidenceRange.length - 1];
    this.eviThreshold = this.evidenceRange[Math.floor(this.evidenceRange.length / 2)];
  }

  initStringVars(): void {
    // Calculate min/max for experiments and database scores and build proteinIdToSymbol map
    this.expMin = this.data[0].experiments;
    this.expMax = this.data[0].experiments;
    this.dbMin = this.data[0].database;
    this.dbMax = this.data[0].database;
    this.proteinIdToSymbol = {};
    for (const ppi of this.data) {
      this.expMin = Math.min(this.expMin, ppi.experiments);
      this.expMax = Math.max(this.expMax, ppi.experiments);
      this.dbMin = Math.min(this.dbMin, ppi.database);
      this.dbMax = Math.max(this.dbMax, ppi.database);
      this.proteinIdToSymbol[ppi.source.proteinId] = ppi.source.symbol;
      this.proteinIdToSymbol[ppi.interactor.proteinId] = ppi.interactor.symbol;
    }
    console.log(this.expMax, this.dbMax);
    // Set initial thresholds
    this.expThreshold = 1;
    this.dbThreshold = 1;
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

    // Add target gene interactions as edges
    for (const edge of this.data) {
      // Skip self edge
      if (edge.interactor.symbol === this.gene.symbol) {
        continue;
      }
      if (this.type === 'string') {
        if (edge.experiments >= this.expThreshold) {
          this.addEdge(edge, 'experiments');
        }
        if (edge.database >= this.dbThreshold) {
          this.addEdge(edge, 'database');
        }
      } else {
        // For curated data, check the evidence threshold
        if (edge.evidences?.length >= this.eviThreshold) {
          this.addEdge(edge);
        }
      }
    }

    // Add non-target gene interaction edges
    for (const edge of this.data) {
      // Skip self edge or no interactor interactions
      if (edge.interactor.symbol === this.gene.symbol ||
        !edge.interactor.ppis?.length) {
        continue;
      }
      // Threshold checks
      if (this.type === 'curated') {
        if (edge.evidences?.length < this.eviThreshold) {
          continue;
        }
      } else if (this.type === 'string') {
        if (edge.experiments < this.expThreshold || edge.database < this.dbThreshold) {
          continue;
        }
      }

      for (const intEdge of edge.interactor.ppis) {
        const searchTermId = this.type === 'string' ? edge.source.proteinId : edge.source.entrezId;
        const fromId = this.type === 'string' ? intEdge.proteinId1 : intEdge.source.entrezId;
        const toId = this.type === 'string' ? intEdge.proteinId2 : intEdge.interactor.entrezId;
        const interactorSymbol = this.type === 'string' ?
          this.proteinIdToSymbol[intEdge.proteinId2] :
          intEdge.interactor.symbol;
        // Skip self edge
        if (fromId === toId) {
          continue;
        }
        // Skip back edge to the search term gene node
        if (toId === searchTermId) {
          continue;
        }
        // Skip if no interactor is in the graph
        if(!this.cy.getElementById(interactorSymbol).isNode()) {
          continue;
        }
        // Add edges based on thresholds
        if (this.type === 'string') {
          const edgeData = {
            source: {
              symbol: this.proteinIdToSymbol[intEdge.proteinId1],
              proteinId: intEdge.proteinId1
            },
            interactor: {
              symbol: interactorSymbol,
              proteinId: intEdge.proteinId2
            },
            experiments: intEdge.experiments,
            database: intEdge.database
          };
          if (intEdge.experiments >= this.expThreshold) {
            this.addEdge(edgeData, 'experiments');
          }
          if (intEdge.database >= this.dbThreshold) {
            this.addEdge(edgeData, 'database');
          }
        } else {
          if (intEdge.evidences?.length >= this.eviThreshold) {
            this.addEdge(intEdge);
          }
        }
      }
    }
    if (this.type === 'curated') {
      this.cy.$('edge').on('tap', (e) => {
        const S = e.target.id().split('||');
        this.showPPITable(e.target);
      });
    }
  }

  addEdge(edge, weightKey?: 'experiments' | 'database'): void {
    let edgeId = `${edge.source.symbol}||${edge.interactor.symbol}`;
    console.log(edgeId);
    this.getNodeByIdOrAdd(edge.interactor.symbol,
      { id: edge.interactor.symbol, name: edge.interactor.symbol });
    if (this.type === 'string') {
      weightKey = weightKey || 'experiments';
      if (weightKey === 'experiments') {
        edgeId += '||exp';
      } else {
        edgeId += '||db';
      }
      this.getEdgeByIdOrAdd(edgeId, {
        id: edgeId,
        source: edge.source.symbol,
        target: edge.interactor.symbol,
        weightKey,
        weight: edge[weightKey],
        maxWeight: weightKey === 'experiments' ? this.expMax : this.dbMax,
        opacity: 0.4 + 0.6 *
          edge[weightKey] / (weightKey === 'experiments' ? this.expMax : this.dbMax)
      });
    } else {
      this.getEdgeByIdOrAdd(edgeId, {
        id: edgeId,
        source: edge.source.symbol,
        target: edge.interactor.symbol,
        evidences: edge.evidences,
        weight: edge.evidences.length,
        maxWeight: this.eviMax,
        opacity: 0.4 + 0.6 * edge.evidences.length / this.eviMax
      });
    }
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
    // Add edge
    return this.cy.add([{
      group: 'edges',
      style: {
        ...EDGE_CONFIG,
        opacity: edgeData['weight'] ? (edgeData['weight'] / edgeData['maxWeight']) : 1
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
