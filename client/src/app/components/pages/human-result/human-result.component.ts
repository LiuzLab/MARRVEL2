import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { ApiService } from '../../../services/api.service';
import { VariantService } from '../../../services/variant.service';

import { HumanGene } from '../../../interfaces/gene';
import { Variant } from '../../../interfaces/variant';

import { Animations } from 'src/app/animations';
import { MatSelectChange } from '@angular/material/select';
import { DIOPTOrtholog } from 'src/app/interfaces/data';

@Component({
  standalone: false,
  selector: 'app-human-result',
  templateUrl: './human-result.component.html',
  styleUrls: ['./human-result.component.scss'],
  animations: [ Animations.fadeInOut, Animations.toggleInOut ]
})
export class HumanResultComponent implements OnInit, AfterViewInit {
  geneLoading = true;
  smallScreen = false;
  activeSection = 'TOP';

  // Input
  geneEntrezId: number | null = null;
  variantInput: string | null = null;
  proteinInput: string | null = null;
  genomeBuild = 'hg19';

  // Processed input
  gene: HumanGene | null = null;
  variant: Variant | null = null;
  hg38Variant: Variant | null = null;
  variantString: string | null = null;

  // Data from server
  geneCandidates: HumanGene[] | null = null;

  omimLoading = true;
  omimData = null;

  orthologsLoading = false;
  orthologs: DIOPTOrtholog[] | null = null;

  clinvarKpi: { significance: Record<string, number>; sigFourTotal: number } | null = null;
  dbnsfpKpi: { cadd: number | null; revel: number | null; alphaMissense: number | null } | null = null;

  ppiLoading = true;
  ppiData;

  gnomadGeneData: any = null;

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private variantService: VariantService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.geneLoading = true;
    this.route.params.subscribe((param) => {
      this.initValues();
      this.geneEntrezId = param.gene ? +param.gene : null;
      this.variantInput = param.variant || null;
      this.proteinInput = param.protein || null;

      // Fix: child route paths are relative (no 'human/' prefix)
      const routePath = this.route.snapshot.routeConfig?.path || '';
      if (routePath.includes('hg38')) {
        this.genomeBuild = 'hg38';
      } else {
        this.genomeBuild = 'hg19';
      }

      if (this.geneEntrezId !== null) {
        this.api.getGeneByEntrezId(this.geneEntrezId)
          .pipe(take(1))
          .subscribe((res) => {
            this.onGeneLoad(res);
            this.cdr.detectChanges();
          });
      }

      if (this.variantInput !== null && this.variantInput !== '') {
        this.parseVariant().toPromise()
          .then((variant: Variant) => {
            if (this.genomeBuild === 'hg19') {
              return this.variantService.liftoverHg19ToHg38(variant)
                .pipe(take(1))
                .toPromise()
                .then((liftover) => {
                  if (liftover.success) { this.hg38Variant = liftover.data; }
                  return variant;
                });
            } else {
              this.hg38Variant = variant;
              return this.variantService.liftoverHg38ToHg19(variant)
                .pipe(take(1))
                .toPromise()
                .then((liftover) => {
                  if (liftover.success) { return liftover.data; }
                  throw Error(liftover.error?.message);
                });
            }
          })
          .then((hg19Variant: Variant) => {
            this.variant = hg19Variant;
            this.variantString = `Chr${hg19Variant.chr}:${hg19Variant.pos} ${hg19Variant.ref}>${hg19Variant.alt}`;
            if (this.gene) { this.geneLoading = false; return; }

            this.geneCandidates = null;
            this.api.getGeneByGenomicLocation(this.variant)
              .pipe(take(1))
              .subscribe((res: HumanGene[]) => {
                this.geneCandidates = res;
                if (res && res.length) {
                  this.onGeneLoad(res[0]);
                } else {
                  this.geneLoading = false;
                  this.gene = null;
                }
                this.cdr.detectChanges();
              });
          })
          .catch((err) => {
            console.error(err);
            this.geneLoading = false;
            this.gene = null;
            this.cdr.detectChanges();
          });
      }
    });
  }

  ngAfterViewInit(): void {
    if (window.innerWidth <= 768) {
      this.smallScreen = true;
    }
  }

  initValues() {
    this.geneLoading = true;
    this.geneEntrezId = null;
    this.variantInput = null;
    this.proteinInput = null;

    this.gene = null;
    this.variant = null;
    this.hg38Variant = null;
    this.variantString = null;
    this.geneCandidates = null;

    this.omimLoading = true;
    this.omimData = null;
    this.orthologsLoading = false;
    this.orthologs = null;
    this.gnomadGeneData = null;
    this.ppiLoading = true;
    this.ppiData = null;
    this.activeSection = 'TOP';
  }

  parseVariant(): Observable<any> {
    return new Observable((obs) => {
      const parsed = this.variantService.parse(this.variantInput);
      if (!parsed.valid) {
        obs.error({ message: `Invalid variant ${this.variantInput}` });
        obs.complete();
        return;
      }
      switch (parsed.type) {
        case 'hgvs':
          this.genomeBuild = 'hg19';
          this.api.getGenomLocByHgvsVar(this.variantInput)
            .pipe(take(1))
            .subscribe((res) => {
              if (res.gene) {
                this.geneEntrezId = res.gene.entrezId;
                this.onGeneLoad(res.gene);
              }
              obs.next({ chr: res.chr, pos: res.pos, ref: res.ref, alt: res.alt });
              obs.complete();
            }, (err) => { obs.error(err); obs.complete(); });
          break;
        case 'coord':
          obs.next(parsed.variant);
          obs.complete();
          break;
        default:
          obs.error({ message: `Invalid variant ${this.variantInput}` });
          obs.complete();
      }
    });
  }

  onGeneSelectionChange(e: MatSelectChange) {
    this.onGeneLoad(e.value);
  }

  onGeneLoad(gene) {
    this.gene = gene;
    this.geneLoading = false;
    this.cdr.detectChanges();

    this.getOMIM();
    this.getOrthologs();
    this.getPPI();
    this.getGnomadGene();
  }

  getGnomadGene() {
    if (!this.gene?.entrezId) { return; }
    this.api.getGnomADGeneByEntrezId(this.gene.entrezId)
      .pipe(take(1))
      .subscribe({
        next: (res) => { this.gnomadGeneData = res; this.cdr.detectChanges(); },
        error: () => { this.gnomadGeneData = null; }
      });
  }

  getPPI() {
    this.ppiLoading = true;
    this.api.getPPI(this.gene).subscribe({
      next: (res) => { this.ppiData = res; this.ppiLoading = false; },
      error: () => { this.ppiData = null; this.ppiLoading = false; }
    });
  }

  getOMIM() {
    if (!this.gene?.xref?.omimId) {
      this.omimData = null;
      this.omimLoading = false;
      return;
    }
    this.omimLoading = true;
    this.api.getOMIMByMimNumber(this.gene.xref.omimId)
      .pipe(take(1))
      .subscribe({
        next: (res) => { this.omimData = res; this.omimLoading = false; },
        error: () => { this.omimData = null; this.omimLoading = false; }
      });
  }

  getOrthologs() {
    this.orthologsLoading = true;
    this.api.getOrthologByEntrezId(this.gene.entrezId)
      .pipe(take(1))
      .subscribe({
        next: (res) => { this.orthologs = res; this.orthologsLoading = false; },
        error: () => { this.orthologsLoading = false; }
      });
  }

  scrollToSection(id: string) {
    this.activeSection = id;
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  onContentScroll(contentEl: HTMLElement) {
    const sections = [
      'TOP','OMIM','DbNSFP','ClinVar','Geno2MP','DECIPHER',
      'GnomAD','DGV','DECIPHER-Control','orthologs','expression',
      'phenotypes','gene-ontology','primate','alignment','ppi',
      'protein-structure','pharos','modelmatcher'
    ];
    const scrollTop = contentEl.scrollTop;
    for (let i = sections.length - 1; i >= 0; i--) {
      const el = document.getElementById(sections[i]);
      if (el && el.offsetTop - contentEl.offsetTop <= scrollTop + 80) {
        this.activeSection = sections[i];
        break;
      }
    }
  }
}
