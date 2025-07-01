const Promise = require('bluebird');
const axios = require('axios');
const CircularJSON = require('circular-json');

const synNameToFieldName = {
  ChEMBL: 'chemblId',
  LyCHI: 'lychiId'
};

const parseLigands = (e) => {
  const act = e.activities && e.activities.length ? e.activities[e.activities.length - 1] : {};
  const D = {
    id: e.ligid,
    name: e.name,
    synonyms: [],
    targetProperties: (e.activities && e.activities.length) ? {
      label: act.type,
      numval: act.value,
      unit: act.moa
    } : {},
    smiles: e.smiles
  };
  for (const syn of e.synonyms) {
    if (syn.name in synNameToFieldName) {
      D[synNameToFieldName[syn.name]] = syn.value;
    }
    D.synonyms.push({
      label: syn.name,
      term: syn.value
    });
  }
  D.name = D.chemblId || D.name;
  return D;
};

exports.queryTargetByAccession = (accession) => {
  return new Promise((resolve, reject) => {
    axios({
      url: 'https://pharos-api.ncats.io/graphql',
      method: 'post',
      data: {
        operationName: 'fetchTargetDetails',
        variables: { term: accession },
        query: `query fetchTargetDetails($term: String) {
  targets: target(q: {uniprot: $term}) {
    ...targetsDetailsFields
  }
}

fragment targetsDetailsFields on Target {
  ...targetsListFields
  drugs: ligands(isdrug: true) {
    ...ligandCardFields
  }
  ligands(isdrug: false) {
    ...ligandCardFields
  }
}

fragment targetsListFields on Target {
  _tcrdid: tcrdid
  name
  gene: sym
  accession: uniprot
  idgFamily: fam
  idgTDL: tdl
  description
}


fragment ligandCardFields on Ligand {
  ligid
  name
  isdrug
  smiles
  synonyms {
    name
    value
  }
  activities(all: false) {
    type
    moa
    value
  }
}`
      },
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      responseType: 'json'
    }).then((res) => {
      const data = JSON.parse(CircularJSON.stringify(res)) || {};
      return ((data.data || {}).data || {}).targets || {};
    }).then((target) => {
      resolve({
        id: accession,
        accession,
        name: target.name,
        idgTDL: target.idgTDL,
        idgFamily: target.idgFamily,
        description: target.description,
        drugs: (target.drugs || []).map((e) => parseLigands(e, target.symbol)),
        ligands: (target.ligands || []).map((e) => parseLigands(e, target.symbol))
      });
    }).catch((err) => {
      reject(err);
    });
  });
};

