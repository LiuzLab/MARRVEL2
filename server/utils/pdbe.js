/*
 * utils/pdbe: Anything related to query PDBe API and to parse the query result
 * */
const got = Promise.promisify(require('got'));

const queryByUniportKBId = (uid) => {
  return new Promise((resolve, reject) => {
    got.get(`https://www.ebi.ac.uk/pdbe/graph-api/uniprot/summary_stats/${uid}`)
      .json()
      .then((doc) => {
        if (uid in doc) {
          // Matching result exists
          resolve({
            uniprotKBId: uid,
            pdbs: doc[uid].pdbs,
            ligands: doc[uid].ligands,
            interactionPartners: doc[uid].interaction_partners,
            annotations: doc[uid].annotations,
            similarProteins: doc[uid].similar_proteins
          });
        } else {
          // No matching result
          resolve({ uniprotKBId: uid });
        }
      }).catch((err) => {
        if (err && err.response && err.response.statusCode === 404) {
          // No matching result (404 response)
          resolve({ uniprotKBId: uid });
        } else {
          // Other errors
          reject(err);
        }
      });
  });
};
exports.queryByUniportKBId = queryByUniportKBId;
