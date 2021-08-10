import { Component, OnInit, AfterViewInit, ViewEncapsulation, ViewChild, ElementRef, Renderer2, Input } from '@angular/core';
import * as molstar from 'molstar/build/viewer/molstar';

@Component({
  selector: 'app-protein-viewer',
  templateUrl: './protein-viewer.component.html',
  styleUrls: ['./protein-viewer.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ProteinViewerComponent implements OnInit, AfterViewInit {
  @Input() uniprotId: string;
  viewer;
  @ViewChild('molstarViewer') molstarViewer: ElementRef;

  constructor(private renderer: Renderer2) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.renderer.setStyle(this.molstarViewer.nativeElement, 'width',
      `${document.getElementById('molstar-wrapper').offsetWidth + 300}px`);

    this.initViwer();
    const url = `https://alphafold.ebi.ac.uk/files/AF-${this.uniprotId}-F1-model_v1.cif`;
    this.viewer.loadStructureFromUrl(url);
  }

  initViwer() {
    this.viewer = new molstar.Viewer(this.molstarViewer.nativeElement, {
      layoutIsExpanded: false,
      layoutShowControls: true,
      layoutShowRemoteState: true,
      layoutShowSequence: true,
      layoutShowLog: false,
      layoutShowLeftPanel: false,
      disableAntialiasing: false,

      viewportShowExpand: true,
      viewportShowControls: false,
      viewportShowSettings: false,
      viewportShowSelectionMode: false,
      viewportShowAnimation: false
    });
  }

  /*
  async initMolstarPlugin(target: HTMLElement) {
    this.plugin = await createPluginAsync(target, {
        ...DefaultPluginUISpec(),
        layout: {
            initial: {
                isExpanded: false,
                showControls: false
            }
        },
        components: {
            remoteState: 'none'
        }
    });

    // this.plugin.representation.structure.themes.colorThemeRegistry.add(StripedResidues.colorThemeProvider);
    // this.plugin.representation.structure.themes.colorThemeRegistry.add(CustomColorThemeProvider);
    // this.plugin.managers.lociLabels.addProvider(StripedResidues.labelProvider);
    // this.plugin.customModelProperties.register(StripedResidues.propertyProvider, true);
  }

  setBackground(color: number) {
    PluginCommands.Canvas3D.SetSettings(this.plugin, {
      settings: props => { props.renderer.backgroundColor = Color(color); }
    });
  }
  */

  /*
  async load({ url, format = 'mmcif', isBinary = false, assemblyId = '' }: LoadParams) {
    await this.plugin.clear();

    const data = await this.plugin.builders.data.download({ url: url }, { state: { isGhost: true } });
    const trajectory = await this.plugin.builders.structure.parseTrajectory(data, format);

    await this.plugin.builders.structure.hierarchy.applyPreset(trajectory, 'default');

    return this.plugin;
  }
  */
}
