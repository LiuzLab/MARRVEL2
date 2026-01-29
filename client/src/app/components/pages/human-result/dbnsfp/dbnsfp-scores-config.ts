export interface ScoreDisplayConfig {
  displayName: string;
  toolKey: string;
  scoreKey: string;
  scoreTransform?: (value: any, method?: string) => any;
  version?: string;
  toolTooltip?: string;
  scoreTooltip?: string;
  rankscoreKey?: string;
}

export const DBNSFP_SCORES_CONFIG: ScoreDisplayConfig[] = [
  {
    displayName: 'CADD phred',
    toolKey: 'CADD',
    scoreKey: 'phred',
    version: 'v1.7',
    scoreTooltip: 'The larger the score the more likely the SNP has damaging effect.',
    rankscoreKey: 'rankscore'
  },
  {
    displayName: 'REVEL',
    toolKey: 'REVEL',
    scoreKey: 'scores',
    version: 'May 3, 2021',
    toolTooltip: 'Ensemble method of 13 tools.',
    scoreTooltip: 'Range = 0 (least damaging) to 1 (most damaging)',
    rankscoreKey: 'rankscore'
  },
  {
    displayName: 'AlphaMissense',
    toolKey: 'AlphaMissense',
    scoreKey: 'predictions',
    toolTooltip: 'unsupervised model incorporating structural context of an AlphaFold-derived system predicts the pathogenicity of human missense variants.',
    scoreTooltip: 'Range: 0 to 1. The larger the score, the more likely the variant is pathogenic.',
    rankscoreKey: 'rankscore'
  },
  {
    displayName: 'PrimateAI',
    toolKey: 'PrimateAI',
    scoreKey: 'prediction',
    toolTooltip: 'Pathogenicity prediction for missense variants based on common variants of non-human primate species using a deep neural network.',
    scoreTooltip: 'Possible scores are: Tolerated or Damaging',
    rankscoreKey: 'rankscore'
  },
  {
    displayName: 'MutationTaster',
    toolKey: 'MutationTaster',
    scoreKey: 'predictions',
    version: '2021',
    toolTooltip: 'MutationTaster prediction. The score cutoff between Disease Causing and Polymorphism is 0.5 for MTnew and 0.31733 for the rankscore.',
    scoreTooltip: 'Possible scores are: Disease Causing Automatic, Disease Causing, Polymorphism, and Polymorphism Automatic',
    rankscoreKey: 'convertedRankscore'
  },
  {
    displayName: 'M-CAP',
    toolKey: 'MCAP',
    scoreKey: 'prediction',
    version: 'v1.3',
    toolTooltip: 'Uses conservation data and trained on mutations linked to Mendelian diseases.',
    scoreTooltip: 'Possible scores are: Tolerated or Damaging',
    rankscoreKey: 'rankscore'
  },
  {
    displayName: 'Polyphen-2 HumDiv',
    toolKey: 'Polyphen2HDIV',
    scoreKey: 'predictions',
    version: 'v2.2.2',
    toolTooltip: 'Uses eight sequence-based and three structure-based predictive features. Trained with Mendelian disease mutations and SNVs from close mammalian homolog proteins.',
    scoreTooltip: 'Possible scores are: Benign, Possibly Damaging, and Probably Damaging',
    rankscoreKey: 'rankscore'
  },
  {
    displayName: 'Polyphen-2 HumVar',
    toolKey: 'Polyphen2HVAR',
    scoreKey: 'predictions',
    version: 'v2.2.2',
    toolTooltip: 'Uses eight sequence-based and three structure-based predictive features. Trained with disease associated and common SNVs.',
    scoreTooltip: 'Possible scores are: Benign, Possibly Damaging, and Probably Damaging',
    rankscoreKey: 'rankscore'
  },
  {
    displayName: 'GERP++',
    toolKey: 'GERP++RS',
    scoreKey: 'score',
    toolTooltip: 'Uses multiple alignments and phylogenetic tree of 34 mammals.',
    scoreTooltip: '-12.3 (least conserved) to 6.17 (most conserved)',
    rankscoreKey: 'rankscore'
  },
  {
    displayName: 'phyloP 100way Vertebrate',
    toolKey: 'phyloP100wayVertebrate',
    scoreKey: 'score',
    toolTooltip: 'Uses multiple alignments and phylogenetic tree of 100 vertebrates.',
    scoreTooltip: 'Range =- 20.0 (least conserved) to 10.003 (most conserved)',
    rankscoreKey: 'rankscore'
  },
  {
    displayName: 'phyloP 470way Mammalian',
    toolKey: 'phyloP470wayMammalian',
    scoreKey: 'score',
    toolTooltip: 'conservation score based on the multiple alignments of 470 mammalian genomes (including human).',
    scoreTooltip: 'Scores range from -20 to 11.936. The larger the score, the more conserved the site.',
    rankscoreKey: 'rankscore'
  }
];