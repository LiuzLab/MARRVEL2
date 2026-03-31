// ─── ACMG/AMP Classification Scoring ────────────────────────────────────────
// Implements Richards et al. 2015 combination rules.

import { AcmgTier, AcmgDirection } from './acmg-criteria';

export type AcmgClassification =
  | 'Pathogenic'
  | 'Likely Pathogenic'
  | 'Variant of Uncertain Significance'
  | 'Likely Benign'
  | 'Benign';

export interface AcmgScore {
  pvs: number;
  ps: number;
  pm: number;
  pp: number;
  ba: number;
  bs: number;
  bp: number;
}

export interface EvidenceEntry {
  code: string;
  tier: AcmgTier;
  direction: AcmgDirection;
  met: boolean;
}

export function computeClassification(evidence: EvidenceEntry[]): {
  classification: AcmgClassification;
  score: AcmgScore;
  metPathogenic: string[];
  metBenign: string[];
} {
  const metPathogenic = evidence
    .filter(e => e.direction === 'pathogenic' && e.met)
    .map(e => e.code);
  const metBenign = evidence
    .filter(e => e.direction === 'benign' && e.met)
    .map(e => e.code);

  const score: AcmgScore = {
    pvs: evidence.filter(e => e.tier === 'PVS' && e.direction === 'pathogenic' && e.met).length,
    ps:  evidence.filter(e => e.tier === 'PS'  && e.direction === 'pathogenic' && e.met).length,
    pm:  evidence.filter(e => e.tier === 'PM'  && e.direction === 'pathogenic' && e.met).length,
    pp:  evidence.filter(e => e.tier === 'PP'  && e.direction === 'pathogenic' && e.met).length,
    ba:  evidence.filter(e => e.tier === 'BA'  && e.direction === 'benign'     && e.met).length,
    bs:  evidence.filter(e => e.tier === 'BS'  && e.direction === 'benign'     && e.met).length,
    bp:  evidence.filter(e => e.tier === 'BP'  && e.direction === 'benign'     && e.met).length,
  };

  const { pvs, ps, pm, pp, ba, bs, bp } = score;

  // ── Benign (any single BA1, or ≥2 BS) ──────────────────────────────────────
  if (ba >= 1) { return { classification: 'Benign', score, metPathogenic, metBenign }; }
  if (bs >= 2) { return { classification: 'Benign', score, metPathogenic, metBenign }; }

  // ── Likely Benign ───────────────────────────────────────────────────────────
  if (bs === 1 && bp === 1) { return { classification: 'Likely Benign', score, metPathogenic, metBenign }; }
  if (bp >= 2)              { return { classification: 'Likely Benign', score, metPathogenic, metBenign }; }

  // ── Pathogenic ──────────────────────────────────────────────────────────────
  if (
    (pvs >= 1 && ps >= 1) ||
    (pvs >= 1 && pm >= 2) ||
    (pvs >= 1 && pm === 1 && pp === 1) ||
    (pvs >= 1 && pp >= 2) ||
    (ps >= 2) ||
    (ps === 1 && pm >= 3) ||
    (ps === 1 && pm === 2 && pp >= 2) ||
    (ps === 1 && pm === 1 && pp >= 4)
  ) {
    return { classification: 'Pathogenic', score, metPathogenic, metBenign };
  }

  // ── Likely Pathogenic ───────────────────────────────────────────────────────
  if (
    (pvs >= 1 && pm === 1) ||
    (ps === 1 && pm >= 1 && pm <= 2) ||
    (ps === 1 && pp >= 2) ||
    (pm >= 3) ||
    (pm === 2 && pp >= 4)
  ) {
    return { classification: 'Likely Pathogenic', score, metPathogenic, metBenign };
  }

  // ── Variant of Uncertain Significance ────────────────────────────────────────
  return { classification: 'Variant of Uncertain Significance', score, metPathogenic, metBenign };
}

export function classificationColor(c: AcmgClassification): string {
  switch (c) {
    case 'Pathogenic':        return '#d32f2f';
    case 'Likely Pathogenic': return '#f57c00';
    case 'Variant of Uncertain Significance': return '#757575';
    case 'Likely Benign':     return '#1976d2';
    case 'Benign':            return '#388e3c';
  }
}
