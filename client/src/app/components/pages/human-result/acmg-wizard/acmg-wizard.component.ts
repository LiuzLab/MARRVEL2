import { Component, OnInit, Inject, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { forkJoin, of } from 'rxjs';
import { catchError, take } from 'rxjs/operators';

import { ApiService } from '../../../../services/api.service';
import { Variant } from '../../../../interfaces/variant';
import { HumanGene } from '../../../../interfaces/gene';

import { ACMG_CRITERIA, AcmgCriterion, AcmgInputData, CriterionStatus } from './acmg-criteria';
import { computeClassification, AcmgClassification, classificationColor, EvidenceEntry } from './acmg-classifier';

export interface AcmgWizardData {
  variant: Variant | null;
  gene: HumanGene | null;
  gnomadKpi: { af: number | null; ac: number | null; homCount: number | null } | null;
  gnomadGeneData: any | null;
  clinvarKpi: { significance: Record<string, number>; sigFourTotal: number } | null;
  dbnsfpKpi: { cadd: number | null; revel: number | null; alphaMissense: number | null } | null;
}

export interface CriterionStep {
  criterion: AcmgCriterion;
  status: CriterionStatus;
  met: boolean | null;
  evidenceText: string | null;
  userAnswer: boolean | null;   // true=yes, false=no, null=uncertain/not asked
}

export interface AcmgSavedResult {
  classification: AcmgClassification;
  metPathogenic: string[];
  metBenign: string[];
  scoreDisplay: { pvs: number; ps: number; pm: number; pp: number; ba: number; bs: number; bp: number };
  steps: Array<{ code: string; met: boolean | null; evidenceText: string | null; userAnswer: boolean | null }>;
  timestamp: number;
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

@Component({
  standalone: false,
  selector: 'app-acmg-wizard',
  templateUrl: './acmg-wizard.component.html',
  styleUrls: ['./acmg-wizard.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
  animations: [
    trigger('cardEnter', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(16px)' }),
        animate('320ms cubic-bezier(.4,0,.2,1)', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('questionSlide', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-12px)' }),
        animate('250ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ opacity: 0, transform: 'translateY(-8px)' }))
      ])
    ]),
    trigger('summaryEnter', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(.95)' }),
        animate('400ms cubic-bezier(.4,0,.2,1)', style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ])
  ]
})
export class AcmgWizardComponent implements OnInit {

  // Wizard state
  phase: 'loading' | 'running' | 'paused' | 'done' = 'loading';
  steps: CriterionStep[] = [];
  activeStep: CriterionStep | null = null;
  activeIndex = -1;

  // Final result
  classification: AcmgClassification | null = null;
  classificationBg = '';
  metPathogenic: string[] = [];
  metBenign: string[] = [];
  scoreDisplay: { pvs: number; ps: number; pm: number; pp: number; ba: number; bs: number; bp: number } | null = null;

  // Live tally (updated as animation runs)
  tallyP = 0;
  tallyB = 0;
  livePvs = 0; livePs = 0; livePm = 0; livePp = 0;
  liveBa = 0; liveBs = 0; liveBp = 0;

  // Data
  private inputData: AcmgInputData | null = null;
  // Promise resolver used to resume playback after user answers a question
  private resumeResolver: ((answer: boolean | null) => void) | null = null;
  // localStorage key for this variant
  private storageKey: string | null = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: AcmgWizardData,
    private dialogRef: MatDialogRef<AcmgWizardComponent>,
    private api: ApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const v = this.dialogData.variant;
    if (v) {
      this.storageKey = `acmg_v1_${v.chr}-${v.pos}-${v.ref}-${v.alt}`;
    }
    this.loadData();
  }

  private loadData(): void {
    this.phase = 'loading';

    // Check for a saved result in localStorage
    if (this.storageKey) {
      try {
        const raw = localStorage.getItem(this.storageKey);
        if (raw) {
          const saved: AcmgSavedResult = JSON.parse(raw);
          this.restoreFromSaved(saved);
          return;
        }
      } catch { /* ignore corrupt data */ }
    }

    const { variant, gnomadKpi, gnomadGeneData, clinvarKpi, dbnsfpKpi } = this.dialogData;

    // Fetch dbNSFP (for PolyPhen2) and forward annotation (for variant type) in parallel
    const dbnsfp$ = variant
      ? this.api.getDbNSFP(variant).pipe(take(1), catchError(() => of(null)))
      : of(null);

    const forwardAnnot$ = variant
      ? this.api.getForwardAnnotByVariant(variant).pipe(take(1), catchError(() => of(null)))
      : of(null);

    forkJoin([dbnsfp$, forwardAnnot$]).subscribe(([dbnsfpFull, forwardAnnot]) => {
      this.inputData = this.buildInputData(gnomadKpi, gnomadGeneData, clinvarKpi, dbnsfpKpi, dbnsfpFull, forwardAnnot);
      this.cdr.detectChanges();
      this.runPlayback();
    });
  }

  private async restoreFromSaved(saved: AcmgSavedResult): Promise<void> {
    this.phase = 'running';
    this.steps = [];
    this.cdr.detectChanges();

    // Fast-replay: show each step with a brief animation
    for (const s of saved.steps) {
      const criterion = ACMG_CRITERIA.find(c => c.code === s.code);
      if (!criterion) { continue; }
      const step: CriterionStep = {
        criterion,
        status: s.met === true ? 'met' : s.met === false ? 'not_met' : 'na',
        met: s.met,
        evidenceText: s.evidenceText,
        userAnswer: s.userAnswer,
      };
      this.steps.push(step);
      this.updateTally(criterion, s.met === true);
      this.cdr.detectChanges();
      await delay(60);
    }

    this.classification = saved.classification;
    this.classificationBg = classificationColor(saved.classification);
    this.metPathogenic = saved.metPathogenic;
    this.metBenign = saved.metBenign;
    this.scoreDisplay = saved.scoreDisplay;
    this.phase = 'done';
    this.activeStep = null;
    this.cdr.detectChanges();
  }

  private saveToLocalStorage(): void {
    if (!this.storageKey) { return; }
    const result: AcmgSavedResult = {
      classification: this.classification!,
      metPathogenic: this.metPathogenic,
      metBenign: this.metBenign,
      scoreDisplay: this.scoreDisplay!,
      steps: this.steps.map(s => ({
        code: s.criterion.code,
        met: s.met,
        evidenceText: s.evidenceText,
        userAnswer: s.userAnswer,
      })),
      timestamp: Date.now(),
    };
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(result));
    } catch { /* storage full — ignore */ }
  }

  private buildInputData(
    gnomadKpi: AcmgWizardData['gnomadKpi'],
    gnomadGeneData: any,
    clinvarKpi: AcmgWizardData['clinvarKpi'],
    dbnsfpKpi: AcmgWizardData['dbnsfpKpi'],
    dbnsfpFull: any,
    forwardAnnot: any
  ): AcmgInputData {

    // Extract PolyPhen2 from full dbNSFP if available
    const polyphenHdivRaw: string[] = dbnsfpFull?.scores?.Polyphen2HDIV?.predictions ?? [];
    const polyphenHvarRaw: string[] = dbnsfpFull?.scores?.Polyphen2HVAR?.predictions ?? [];
    const ppWeights: Record<string, number> = { B: 0, P: 1, D: 2 };
    const ppValues: Record<number, string> = { 0: 'B', 1: 'P', 2: 'D' };

    const maxPred = (arr: string[]): string | null => {
      const valid = arr.filter(s => s != null && ppWeights[s] !== undefined);
      if (!valid.length) { return null; }
      return ppValues[Math.max(...valid.map(s => ppWeights[s]))];
    };

    // Detect variant type from forward annotation
    let variantType: string | null = null;
    let variantAnnot: string | null = null;
    if (forwardAnnot?.candidates?.length) {
      // Use canonical first, then mostAgreed
      const canonical = forwardAnnot.candidates.find((c: any) => c.isCanonical);
      const best = canonical || forwardAnnot.candidates[0];
      variantAnnot = best?.coord?.annot ?? null;
      variantType = this.detectVariantType(variantAnnot);
    } else if (forwardAnnot?.canonical?.coord?.annot) {
      variantAnnot = forwardAnnot.canonical.coord.annot;
      variantType = this.detectVariantType(variantAnnot);
    }

    // Also check gnomAD funcAnno from geno2mp-like data if available
    if (!variantType && dbnsfpFull?.funcAnno) {
      variantType = dbnsfpFull.funcAnno;
    }

    const isMissense = variantType
      ? variantType.toLowerCase().includes('missense')
      : (!variantAnnot ? false : this.detectVariantType(variantAnnot) === 'missense');

    const clinvarSigs = clinvarKpi?.significance
      ? Object.keys(clinvarKpi.significance).filter(k => (clinvarKpi.significance[k] ?? 0) > 0)
      : [];

    return {
      gnomadAf: gnomadKpi?.af ?? null,
      gnomadGeneZ: gnomadGeneData?.mis?.z ?? null,
      gnomadGeneLoeuf: gnomadGeneData?.lof?.oeUpper ?? null,
      variantType,
      variantAnnot,
      dbnsfpScores: {
        cadd: dbnsfpKpi?.cadd ?? null,
        revel: dbnsfpKpi?.revel ?? null,
        alphaMissense: dbnsfpKpi?.alphaMissense ?? null,
        polyphen2Hdiv: maxPred(polyphenHdivRaw),
        polyphen2Hvar: maxPred(polyphenHvarRaw),
      },
      clinvarSignificances: clinvarSigs,
      isMissense,
    };
  }

  private detectVariantType(annot: string | null): string | null {
    if (!annot) { return null; }
    const a = annot.toLowerCase();
    if (/\*\d*$/.test(annot) || a.includes('ter') || a.includes('stop') || a.includes('nonsense')) {
      return 'stopgain';
    }
    if (a.includes('fs') || a.includes('frameshift')) {
      return 'frameshift';
    }
    if (a.includes('splice') || /c\.\d+[+-]\d+/.test(annot)) {
      return 'splicing';
    }
    if (/p\.[A-Z][a-z]{2}\d+[A-Z][a-z]{2}/.test(annot)) {
      return 'missense';
    }
    return 'other';
  }

  private buildEvidenceText(criterion: AcmgCriterion, met: boolean | null): string {
    const d = this.inputData!;
    switch (criterion.code) {
      case 'BA1':
        return d.gnomadAf !== null
          ? `gnomAD AF = ${d.gnomadAf.toExponential(2)} (threshold: 5%)`
          : 'Not found in gnomAD';
      case 'BS1':
        return d.gnomadAf !== null
          ? `gnomAD AF = ${d.gnomadAf.toExponential(2)} (threshold: 1%)`
          : 'Not found in gnomAD';
      case 'PM2':
        return d.gnomadAf !== null
          ? `gnomAD AF = ${d.gnomadAf.toExponential(2)} (threshold: 0.1%)`
          : 'Absent in gnomAD';
      case 'PVS1': {
        const typeStr = d.variantType || (d.variantAnnot ? `"${d.variantAnnot}"` : 'unknown');
        const loeufStr = d.gnomadGeneLoeuf !== null ? `, LOEUF = ${d.gnomadGeneLoeuf.toFixed(2)}` : '';
        return `Variant type: ${typeStr}${loeufStr}`;
      }
      case 'PP3': {
        const parts: string[] = [];
        if (d.dbnsfpScores.cadd !== null) { parts.push(`CADD ${d.dbnsfpScores.cadd.toFixed(1)}`); }
        if (d.dbnsfpScores.revel !== null) { parts.push(`REVEL ${d.dbnsfpScores.revel.toFixed(2)}`); }
        if (d.dbnsfpScores.alphaMissense !== null) { parts.push(`AM ${d.dbnsfpScores.alphaMissense.toFixed(2)}`); }
        if (d.dbnsfpScores.polyphen2Hdiv) { parts.push(`PP2-HumDiv ${d.dbnsfpScores.polyphen2Hdiv}`); }
        return parts.join(' · ') || 'No in-silico scores available';
      }
      case 'BP4': {
        const parts: string[] = [];
        if (d.dbnsfpScores.cadd !== null) { parts.push(`CADD ${d.dbnsfpScores.cadd.toFixed(1)}`); }
        if (d.dbnsfpScores.revel !== null) { parts.push(`REVEL ${d.dbnsfpScores.revel.toFixed(2)}`); }
        if (d.dbnsfpScores.alphaMissense !== null) { parts.push(`AM ${d.dbnsfpScores.alphaMissense.toFixed(2)}`); }
        return parts.join(' · ') || 'No in-silico scores available';
      }
      case 'PP5':
      case 'BP6': {
        const sigs = d.clinvarSignificances;
        return sigs.length ? `ClinVar: ${sigs.join(', ')}` : 'No ClinVar submissions found';
      }
      case 'PP2':
        return d.gnomadGeneZ !== null
          ? `Missense Z-score = ${d.gnomadGeneZ.toFixed(2)} (threshold: 3.09)`
          : 'gnomAD gene Z-score not available';
      default:
        return met === true ? 'Met per user input' : met === false ? 'Not met per user input' : 'Uncertain / not applicable';
    }
  }

  private async runPlayback(): Promise<void> {
    this.phase = 'running';
    this.steps = [];
    this.activeIndex = -1;
    this.tallyP = 0;
    this.tallyB = 0;
    this.cdr.detectChanges();

    for (let i = 0; i < ACMG_CRITERIA.length; i++) {
      const criterion = ACMG_CRITERIA[i];

      // Add card in "entering" state
      const step: CriterionStep = {
        criterion,
        status: 'scanning',
        met: null,
        evidenceText: null,
        userAnswer: null,
      };
      this.steps.push(step);
      this.activeIndex = i;
      this.activeStep = step;
      this.cdr.detectChanges();

      await delay(400);  // card appear pause

      let met: boolean | null = null;

      if (criterion.autoEval) {
        // Auto evaluate
        step.status = 'scanning';
        this.cdr.detectChanges();
        await delay(600);  // scanning animation

        const result = criterion.autoEval(this.inputData!);

        if (result === null) {
          // N/A — check if has a question fallback
          if (criterion.question) {
            met = await this.askUser(step, criterion);
          } else {
            step.status = 'na';
            step.met = null;
            step.evidenceText = 'Not applicable for this variant type';
            this.cdr.detectChanges();
            await delay(300);
            continue;
          }
        } else {
          met = result;
          step.evidenceText = this.buildEvidenceText(criterion, met);
          step.met = met;
          step.status = met ? 'met' : 'not_met';
          this.cdr.detectChanges();
          await delay(350);
        }
      } else if (criterion.question) {
        // Pure user-input criterion
        met = await this.askUser(step, criterion);
      }

      if (met === true) {
        step.status = 'met';
        step.met = true;
        if (!step.evidenceText) { step.evidenceText = this.buildEvidenceText(criterion, true); }
        this.updateTally(criterion, true);
      } else if (met === false) {
        step.status = 'not_met';
        step.met = false;
        if (!step.evidenceText) { step.evidenceText = this.buildEvidenceText(criterion, false); }
      } else {
        // uncertain answer
        step.status = 'na';
        step.met = null;
        if (!step.evidenceText) { step.evidenceText = 'Uncertain — not counted'; }
      }

      this.cdr.detectChanges();
      await delay(280);
    }

    // Compute final classification
    const evidence: EvidenceEntry[] = this.steps
      .filter(s => s.met !== null)
      .map(s => ({
        code: s.criterion.code,
        tier: s.criterion.tier,
        direction: s.criterion.direction,
        met: s.met!,
      }));

    const result = computeClassification(evidence);
    this.classification = result.classification;
    this.classificationBg = classificationColor(result.classification);
    this.metPathogenic = result.metPathogenic;
    this.metBenign = result.metBenign;
    this.scoreDisplay = result.score;
    this.phase = 'done';
    this.activeStep = null;
    this.cdr.detectChanges();

    this.saveToLocalStorage();
  }

  private askUser(step: CriterionStep, criterion: AcmgCriterion): Promise<boolean | null> {
    this.phase = 'paused';
    step.status = 'waiting_input';
    this.cdr.detectChanges();

    return new Promise<boolean | null>(resolve => {
      this.resumeResolver = resolve;
    });
  }

  answerQuestion(answer: boolean | null): void {
    if (!this.resumeResolver) { return; }
    const resolver = this.resumeResolver;
    this.resumeResolver = null;

    const step = this.activeStep!;
    step.userAnswer = answer;
    step.evidenceText = answer === true
      ? 'Yes — confirmed by user'
      : answer === false
        ? 'No — confirmed by user'
        : 'Uncertain — not counted';

    this.phase = 'running';
    this.cdr.detectChanges();
    resolver(answer);
  }

  private updateTally(criterion: AcmgCriterion, met: boolean): void {
    if (!met) { return; }
    if (criterion.direction === 'pathogenic') {
      this.tallyP++;
      switch (criterion.tier) {
        case 'PVS': this.livePvs++; break;
        case 'PS':  this.livePs++;  break;
        case 'PM':  this.livePm++;  break;
        case 'PP':  this.livePp++;  break;
      }
    } else {
      this.tallyB++;
      switch (criterion.tier) {
        case 'BA': this.liveBa++; break;
        case 'BS': this.liveBs++; break;
        case 'BP': this.liveBp++; break;
      }
    }
  }

  close(): void {
    if (this.classification) {
      const result: AcmgSavedResult = {
        classification: this.classification,
        metPathogenic: this.metPathogenic,
        metBenign: this.metBenign,
        scoreDisplay: this.scoreDisplay!,
        steps: this.steps.map(s => ({
          code: s.criterion.code,
          met: s.met,
          evidenceText: s.evidenceText,
          userAnswer: s.userAnswer,
        })),
        timestamp: Date.now(),
      };
      this.dialogRef.close(result);
    } else {
      this.dialogRef.close();
    }
  }

  tierColor(tier: string, direction: string): string {
    if (direction === 'benign') {
      switch (tier) {
        case 'BA': return '#1b5e20';
        case 'BS': return '#388e3c';
        case 'BP': return '#66bb6a';
      }
    } else {
      switch (tier) {
        case 'PVS': return '#b71c1c';
        case 'PS':  return '#d32f2f';
        case 'PM':  return '#f57c00';
        case 'PP':  return '#ffa726';
      }
    }
    return '#757575';
  }
}
