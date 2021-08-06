import { Component, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';
import * as molstar from 'molstar/build/viewer/molstar';

@Component({
  selector: 'app-protein-viewer',
  templateUrl: './protein-viewer.component.html',
  styleUrls: ['./protein-viewer.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ProteinViewerComponent implements OnInit, AfterViewInit {
  viewer;

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.viewer = this.initMolstarViewer('molstar-viewer');
    this.loadPdb();
  }

  initMolstarViewer(target: string | HTMLElement) {
    return new molstar.Viewer(target, {
      layoutIsExpanded: false,
      layoutShowControls: false,
      layoutShowRemoteState: false,
      layoutShowSequence: true,
      layoutShowLog: false,
      layoutShowLeftPanel: true,

      viewportShowExpand: true,
      viewportShowSelectionMode: false,
      viewportShowAnimation: false,

      pdbProvider: 'rcsb',
      emdbProvider: 'rcsb'
    });
  }

  loadPdb() {
    this.viewer.loadPdb('7bv2');
    // this.viewer.loadEmdb('EMD-30210', { detail: 6 });
  }

}
