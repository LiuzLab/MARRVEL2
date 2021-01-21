const Promise = require('bluebird');
const axios = require('axios');
const CircularJSON = require('circular-json');

const synNameToFieldName = {
  ChEMBL: 'chemblId',
  LyCHI: 'lychiId'
};

const parseLigands = (e, targetSymbol) => {
  D = {
    id: e.ligid,
    name: e.name,
    synonyms: [],
    targetProperties: (e.activities || [])
      .filter((act) => act.target.sym === targetSymbol)
      .map((act) => {
        return {
          label: act.type,
          numval: act.value,
          unit: act.moa
        };
      }),
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
        query: `query fetchTargetDetails($term: String, $drugstop: Int, $drugsskip: Int, $ligandstop: Int, $ligandsskip: Int) {
  targets: target(q: {sym: $term, uniprot: $term, stringid: $term}) {
    ...targetsDetailsFields
    tdl
    sym
    fam
    name
    description
  }
}

fragment targetsDetailsFields on Target {
  drugs: ligands(top: $drugstop, skip: $drugsskip, isdrug: true) {
    ...ligandCardFields
  }
  ligands(top: $ligandstop, skip: $ligandsskip, isdrug: false) {
    ...ligandCardFields
  }
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
  activityCount: actcnt
  activities(all: false) {
    type
    moa
    value
    target {
      sym
    }
  }
}`
      },
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      responseType: 'json'
    }).then((res) => {
      const data = JSON.parse(CircularJSON.stringify(res)) || {};
      return ((data.data || {}).data || {}).targets || {};
    }).then((target) => {
      resolve({
        id: accession,
        accession: accession,
        name: target.name,
        idgTDL: target.tdl,
        idgFamily: target.fam,
        description: target.description,
        drugs: (target.drugs || []).map((e) => parseLigands(e, target.symbol)),
        ligands: (target.ligands || []).map((e) => parseLigands(e, target.symbol))
      })
    }).catch((err) => {
      reject(err);
    });
  });
};

