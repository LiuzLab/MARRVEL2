export const FUNCANNO_TO_CAT_NUM = {
    'non-coding-exon': 0,
    'upstream-gene': 0,
    'missense': 2,
    'synonymous': 1,
    'stop-gained': 3,
    'intergenic': 0,
    'intron': 0,
    'downstream-gene':  0,
    '5-prime-UTR': 0,
    'missense-near-splice': 2,
    'intron-near-splice': 0,
    'splice-donor': 3,
    'coding': 1,
    'frameshift': 3,
    'codingComplex': 2,
    '3-prime-UTR': 0,
    'frameshift-near-splice': 3,
    'splice-acceptor': 3,
    'synonymous-near-splice': 1,
    'coding-near-splice': 2,
    'stop-lost': 3,
    'stop-gained-near-splice': 3,
    'non-coding-exon-near-splice': 0,
    'codingComplex-near-splice': 2,
    'stop-lost-near-splice': 3,
    'coding-unknown': 1,
    'coding-unknown-near-splice': 1
};

export const CAT_NUM_TO_CAT_NAME = [
    'Non-Coding',
    'Synonymouse/Unknown',
    'Missense/Other Indel',
    'Splice/Frameshift/Nonsense/Stop Loss'
];
