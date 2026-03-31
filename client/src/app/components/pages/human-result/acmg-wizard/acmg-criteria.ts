// ─── ACMG/AMP 2015 Criteria for MARRVEL ─────────────────────────────────────
// Richards et al. 2015, Genetics in Medicine 17:405–424

export type AcmgTier = 'PVS' | 'PS' | 'PM' | 'PP' | 'BA' | 'BS' | 'BP';
export type AcmgDirection = 'pathogenic' | 'benign';
export type CriterionStatus = 'met' | 'not_met' | 'na' | 'pending' | 'scanning' | 'waiting_input';

export interface AcmgInputData {
  gnomadAf: number | null;            // variant allele frequency
  gnomadGeneZ: number | null;         // gene missense z-score
  gnomadGeneLoeuf: number | null;     // gene LoF o/e upper bound
  variantType: string | null;         // 'stopgain'|'frameshift'|'splicing'|'missense'|'synonymous'|...
  variantAnnot: string | null;        // raw annotation string from forward annotation
  dbnsfpScores: {
    cadd: number | null;
    revel: number | null;
    alphaMissense: number | null;
    polyphen2Hdiv: string | null;     // 'B'|'P'|'D' (max across isoforms)
    polyphen2Hvar: string | null;
  };
  clinvarSignificances: string[];     // keys from clinvarKpi.significance
  isMissense: boolean;
}

export interface AcmgCriterion {
  code: string;
  label: string;
  tier: AcmgTier;
  direction: AcmgDirection;
  /** Returns true (met), false (not met), null (N/A — skip) */
  autoEval?: (data: AcmgInputData) => boolean | null;
  /** If set, wizard pauses and shows this question. Answer: true=yes, false=no, null=uncertain */
  question?: string;
  questionContext?: string;   // extra tooltip / explanation
}

// ─── Helper: count "damaging" in-silico tools ────────────────────────────────

function countDamagingTools(scores: AcmgInputData['dbnsfpScores']): number {
  let n = 0;
  if (scores.cadd !== null && scores.cadd >= 20) { n++; }
  if (scores.revel !== null && scores.revel >= 0.5) { n++; }
  if (scores.alphaMissense !== null && scores.alphaMissense >= 0.564) { n++; }
  if (scores.polyphen2Hdiv === 'D' || scores.polyphen2Hdiv === 'P') { n++; }
  if (scores.polyphen2Hvar === 'D' || scores.polyphen2Hvar === 'P') { n++; }
  return n;
}

function countBenignTools(scores: AcmgInputData['dbnsfpScores']): number {
  let n = 0;
  if (scores.cadd !== null && scores.cadd < 10) { n++; }
  if (scores.revel !== null && scores.revel <= 0.25) { n++; }
  if (scores.alphaMissense !== null && scores.alphaMissense <= 0.34) { n++; }
  if (scores.polyphen2Hdiv === 'B') { n++; }
  if (scores.polyphen2Hvar === 'B') { n++; }
  return n;
}

function isLofVariant(data: AcmgInputData): boolean {
  const type = (data.variantType || '').toLowerCase();
  const annot = (data.variantAnnot || '').toLowerCase();
  return (
    type.includes('stopgain') ||
    type.includes('frameshift') ||
    type.includes('splicing') ||
    type.includes('stop_gained') ||
    type.includes('nonsense') ||
    type.includes('frameshift_deletion') ||
    type.includes('frameshift_insertion') ||
    annot.includes('fs') ||
    annot.includes('ter') ||
    /\*\d*$/.test(annot) ||
    annot.includes('splice')
  );
}

// ─── Criteria list (in evaluation order) ─────────────────────────────────────

export const ACMG_CRITERIA: AcmgCriterion[] = [

  // ── Benign Stand-Alone ──────────────────────────────────────────────────────
  {
    code: 'BA1',
    label: 'Allele frequency > 5% in gnomAD',
    tier: 'BA',
    direction: 'benign',
    autoEval: (d) => {
      if (d.gnomadAf === null) { return null; }
      return d.gnomadAf > 0.05;
    }
  },

  // ── Pathogenic Very Strong ───────────────────────────────────────────────────
  {
    code: 'PVS1',
    label: 'Null variant in gene where LoF is disease mechanism',
    tier: 'PVS',
    direction: 'pathogenic',
    autoEval: (d) => {
      if (!isLofVariant(d)) { return null; }
      // If gnomAD LOEUF < 0.35 the gene is constrained — LoF likely pathogenic
      if (d.gnomadGeneLoeuf !== null) {
        return d.gnomadGeneLoeuf < 0.35;
      }
      // If we can detect LoF but can't assess constraint, return true (tentative)
      return true;
    }
  },

  // ── Pathogenic Strong ────────────────────────────────────────────────────────
  {
    code: 'PS2',
    label: 'De novo (both maternity and paternity confirmed)',
    tier: 'PS',
    direction: 'pathogenic',
    question: 'Has this variant been confirmed de novo (paternity and maternity verified by testing)?',
    questionContext: 'PS2 requires confirmed de novo status. This cannot be inferred from population databases.'
  },
  {
    code: 'PS3',
    label: 'Functional studies show damaging effect',
    tier: 'PS',
    direction: 'pathogenic',
    question: 'Are there published functional studies demonstrating a damaging effect on the gene/protein product?',
    questionContext: 'PS3 requires well-established in vitro or in vivo functional studies (not just computational predictions).'
  },
  {
    code: 'PP5',
    label: 'ClinVar: reputable source reports Pathogenic',
    tier: 'PP',
    direction: 'pathogenic',
    autoEval: (d) => {
      if (!d.clinvarSignificances.length) { return null; }
      return d.clinvarSignificances.some(s =>
        s === 'pathogenic' || s === 'likely pathogenic'
      );
    }
  },

  // ── Pathogenic Moderate ──────────────────────────────────────────────────────
  {
    code: 'PM2',
    label: 'Absent / extremely low frequency in gnomAD',
    tier: 'PM',
    direction: 'pathogenic',
    autoEval: (d) => {
      if (d.gnomadAf === null) { return true; }   // absent = met
      return d.gnomadAf < 0.001;
    }
  },
  {
    code: 'PM6',
    label: 'De novo (assumed, parental testing not done)',
    tier: 'PM',
    direction: 'pathogenic',
    question: 'Is this variant assumed de novo (phenotypically consistent, but parental testing was not performed)?',
    questionContext: 'PM6 applies when de novo cannot be formally confirmed but clinical context strongly suggests it.'
  },
  {
    code: 'PM3',
    label: 'Detected in trans with a known pathogenic variant (recessive)',
    tier: 'PM',
    direction: 'pathogenic',
    question: 'Was this variant detected in trans with a known pathogenic variant in a recessive disease gene?',
    questionContext: 'PM3 requires genetic confirmation that the variants are on opposite chromosomes.'
  },

  // ── Pathogenic Supporting ────────────────────────────────────────────────────
  {
    code: 'PP1',
    label: 'Co-segregation with disease in multiple affected relatives',
    tier: 'PP',
    direction: 'pathogenic',
    question: 'Has the variant co-segregated with disease in multiple affected family members?',
    questionContext: 'PP1 requires segregation data from the family. The more affected members who carry the variant, the stronger the evidence.'
  },
  {
    code: 'PP2',
    label: 'Missense in gene with low tolerance for missense variation',
    tier: 'PP',
    direction: 'pathogenic',
    autoEval: (d) => {
      if (!d.isMissense) { return null; }
      if (d.gnomadGeneZ !== null) {
        return d.gnomadGeneZ > 3.09;
      }
      return null;
    }
  },
  {
    code: 'PP3',
    label: 'Multiple in-silico tools predict damaging effect',
    tier: 'PP',
    direction: 'pathogenic',
    autoEval: (d) => {
      if (!d.isMissense) { return null; }
      return countDamagingTools(d.dbnsfpScores) >= 3;
    }
  },
  {
    code: 'PP4',
    label: "Patient's phenotype highly specific for this gene/disease",
    tier: 'PP',
    direction: 'pathogenic',
    question: "Is the patient's phenotype or family history highly specific for a disease caused by this gene?",
    questionContext: 'PP4 is met when the clinical presentation is so specific that there is minimal phenotypic overlap with other diseases.'
  },

  // ── Benign Strong ────────────────────────────────────────────────────────────
  {
    code: 'BS1',
    label: 'Allele frequency > 1% in gnomAD',
    tier: 'BS',
    direction: 'benign',
    autoEval: (d) => {
      if (d.gnomadAf === null) { return null; }
      return d.gnomadAf > 0.01;
    }
  },
  {
    code: 'BS2',
    label: 'Observed in healthy adult in gnomAD (homozygous / hemizygous)',
    tier: 'BS',
    direction: 'benign',
    question: 'Has the variant been observed homozygous in a healthy adult (recessive disease) or hemizygous in a healthy male (X-linked disease)?',
    questionContext: 'BS2 applies when the expected penetrance for the disease is high and the individual carrying two copies is unaffected.'
  },
  {
    code: 'BS3',
    label: 'Functional studies show no damaging effect',
    tier: 'BS',
    direction: 'benign',
    question: 'Are there published functional studies that show the variant has no damaging effect on the protein product?',
    questionContext: 'BS3 requires well-established functional assays that demonstrate the variant is benign.'
  },
  {
    code: 'BS4',
    label: 'Lack of segregation in affected family members',
    tier: 'BS',
    direction: 'benign',
    question: 'Has the variant been shown NOT to segregate with disease in affected family members (with full penetrance expected)?',
    questionContext: 'BS4 requires that affected relatives do not carry the variant, suggesting it is not causative.'
  },

  // ── Benign Supporting ────────────────────────────────────────────────────────
  {
    code: 'BP1',
    label: 'Missense in gene where truncating variants are the mechanism',
    tier: 'BP',
    direction: 'benign',
    autoEval: (d) => {
      // If variant is missense AND gene is highly LoF constrained (LOEUF < 0.35), this criterion
      // is actually inapplicable. BP1 applies in genes where only LoF causes disease.
      // Conservative: return null (N/A) unless we have strong evidence.
      if (!d.isMissense) { return null; }
      return null; // Requires clinical knowledge we don't have — skip to user question
    },
    question: 'Is this a missense variant in a gene where ONLY truncating variants have been reported as causative?',
    questionContext: 'BP1 applies when the disease mechanism is exclusively via loss-of-function, making missense variants unlikely to be pathogenic.'
  },
  {
    code: 'BP4',
    label: 'Multiple in-silico tools predict benign effect',
    tier: 'BP',
    direction: 'benign',
    autoEval: (d) => {
      if (!d.isMissense) { return null; }
      return countBenignTools(d.dbnsfpScores) >= 3;
    }
  },
  {
    code: 'BP5',
    label: 'Alternate molecular cause identified',
    tier: 'BP',
    direction: 'benign',
    question: 'Has an alternate molecular cause for the patient\'s disease been identified in this patient?',
    questionContext: 'BP5 applies when another variant has been identified that fully explains the patient\'s phenotype.'
  },
  {
    code: 'BP6',
    label: 'ClinVar: reputable source reports Benign',
    tier: 'BP',
    direction: 'benign',
    autoEval: (d) => {
      if (!d.clinvarSignificances.length) { return null; }
      return d.clinvarSignificances.some(s =>
        s === 'benign' || s === 'likely benign'
      );
    }
  },
];
