import { Component, OnChanges, Input, SimpleChanges, ViewChild, AfterViewInit } from '@angular/core';
import { MatSort, MatTableDataSource, MatPaginator } from '@angular/material';

import { Animations } from '../../../../animations';

import { HumanGene } from '../../../../interfaces/gene';
import { AGR_SLIM_IDS, AGR_SLIM_ID_TO_NAME } from './agrSlim';
const TAXONID_TO_NAME = {
  10090: 'mouse',
  10116: 'rat',
  7227: 'fly',
  7955: 'zebrafish',
  6239: 'worm',
  4932: 'yeast',
  4896: 'fission yeast',
};
const ORGNAME_TO_ICON = {
  'mouse': '002-mouse',
  'rat': '003-rat',
  'zebrafish': '004-fish',
  'fly': '005-fly',
  'worm': '006-worm',
  'yeast': '007-yeast',
  'fission yeast': '008-fyeast',
};
const EXP_EVICODES = {
  'IEP': true,
  'IDA': true,
  'IMP': true,
  'IGI': true,
  'IPI': true,
  'IAGP': true
};
const NAMESPACE_TO_GOID = {
  'molecular_function': 'GO:0003674',
  'biological_process': 'GO:0008150',
  'cellular_component': 'GO:0005575'
};

@Component({
  selector: 'app-gene-ontology',
  templateUrl: './gene-ontology.component.html',
  styleUrls: ['./gene-ontology.component.scss'],
  animations: [ Animations.toggle ]
})
export class GeneOntologyComponent implements OnChanges, AfterViewInit {
  @Input() gene: HumanGene;
  @Input()  orthologs;

  gos = null;
  categoryGoIds = AGR_SLIM_IDS;
  orgNameToIcons = ORGNAME_TO_ICON;
  goIdToName = AGR_SLIM_ID_TO_NAME;
  visHeight = 200;
  visHeightOnlyBest = 200;
  hoverGoId = null;
  selected = null;

  showOnlyBest = true;

  displayedColumns = ['name', 'namespace', 'eviCode', 'references'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor() { }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.gene && changes.gene.currentValue) {
      this.gos = this.gos || {};
      this.gos['human'] = { gos: {} };
      for (const go of this.gene.gos) {
        if (go.eviCode in EXP_EVICODES && go.ontology) {
          const slimGoId = go.ontology.agrSlimGoId || NAMESPACE_TO_GOID[go.ontology.namespace];
          if (slimGoId) {
            this.gos['human']['gos'][slimGoId] = this.gos['human']['gos'][slimGoId] || [];
            this.gos['human']['gos'][slimGoId].push(go);
          }
        }
      }
    }
    if (changes.orthologs && changes.orthologs.currentValue) {
      this.visHeight = 200;
      this.visHeightOnlyBest = 200;
      this.gos = this.gos || {};
      for (const ortholog of this.orthologs) {
        if (!(ortholog.taxonId2 in TAXONID_TO_NAME)) continue;
        const orgName = TAXONID_TO_NAME[ortholog.taxonId2];
        this.gos[orgName] = this.gos[orgName] || [];

        if (!ortholog.gene2 || !ortholog.gene2.gos || !ortholog.gene2.gos.length) continue;
        this.visHeight += 20;
        this.visHeightOnlyBest += ortholog.bestScore ? 20 : 0;
        const D = {};
        for (const go of ortholog.gene2.gos) {
          if (go.eviCode in EXP_EVICODES && go.ontology) {
            const slimGoId = go.ontology.agrSlimGoId || NAMESPACE_TO_GOID[go.ontology.namespace];
            go.name = go.ontology.name;
            if (slimGoId) {
              D[slimGoId] = D[slimGoId] || [];
              D[slimGoId].push(go);
            }
          }
        }
        ortholog.gene2.taxonId = ortholog.taxonId2;
        this.gos[orgName].push({
          score: ortholog.score,
          bestScore: ortholog.bestScore,
          gene: ortholog.gene2,
          gos: D
        });
      }

      console.log(this.gos);
    }
  }

  getUrl(gene) {
    switch (gene.taxonId) {
      case 10090:
        return `http://www.informatics.jax.org/marker/${gene['mgiId']}`;
      case 10116:
        return `http://rgd.mcw.edu/rgdweb/report/gene/main.html?id=${gene['rgdId']}`;
      case 7955:
        return `http://zfin.org/action/marker/view/${gene['zfinId']}`;
      case 4932:
        return `http://www.yeastgenome.org/locus/${gene['sgdId']}`;
      case 4896:
        return `https://www.pombase.org/gene/${gene['pomBaseId']}`;
      case 7227:
        return `http://flybase.org/reports/${gene['flyBaseId']}.html`;
      case 6239:
        return `http://www.wormbase.org/species/c_elegans/gene/${gene['wormBaseId']}`;
    }
    return '';
  }

  mouseChange(enter: boolean, goId: string) {
    if (enter) {
      this.hoverGoId = goId;
    }
    else {
      this.hoverGoId = null;
    }
  }

  selectGeneGo(orgName, idx, goId) {
    if (this.selected && this.selected['orgName'] === orgName && this.selected['idx'] === idx && this.selected['goId'] === goId) {
      this.selected = null;
      return ;
    }
    this.selected = {
      orgName: orgName,
      idx: idx,
      goId: goId
    };
    const gos = orgName === 'human' ? this.gos[orgName].gos[goId] : this.gos[orgName][idx].gos[goId];

    this.dataSource = new MatTableDataSource(gos);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getRefUrl(refId) {
    if (refId.substr(0, 5) === 'PMID:') {
      return `https://www.ncbi.nlm.nih.gov/pubmed/${refId.substr(5)}`;
    }
    if (refId.substr(0, 3) === 'FB:') {
      return `https://flybase.org/reports/${refId.substr(3)}`;
    }
    if (refId.substr(0, 4) === 'MGI:') {
      return `http://www.informatics.jax.org/reference/summary?id=mgi:${refId.substr(8)}`;
    }
    if (refId.substr(0, 4) === 'RGD:') {
      return `https://rgd.mcw.edu/rgdweb/report/reference/main.html?id=${refId.substr(4)}`;
    }
    if (refId.substr(0, 5) === 'ZFIN:') {
      return `http://zfin.org/${refId.substr(5)}`;
    }
    if (refId.substr(0, 7) === 'WB_REF:') {
      return `https://wormbase.org/resources/paper/${refId.substr(7)}`;
    }
  }

}
