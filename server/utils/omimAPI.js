const rp = require('request-promise');
const apiKey = require('../config').omim;

exports.queryByMimNumber = (mimNumber) => {
  return new Promise((resolve, reject) => {
    rp({
      uri: 'https://api.omim.org/api/entry',
      qs: {
        mimNumber,
        format: 'json',
        include: 'geneMap,text,allelicVariantList',
        apiKey
      },
      headers: { 'User-Agent': 'Request-Promise' },
      json: true
    })
      .then((res) => {
        if (!res.omim.entryList || !res.omim.entryList.length || !res.omim.entryList[0].entry) {
          return null;
        } else {
          return res.omim.entryList[0].entry;
        }
      }).then((data) => {
        const D = {
          mimNumber: data.mimNumber,
          status: data.status
        };
        if (data.titles) D.title = data.titles.preferredTitle || '';
        if (data.geneMap && data.geneMap.phenotypeMapList) {
          D.phenotypes = data.geneMap.phenotypeMapList.map(e => {
            return e.phenotypeMap;
          }) || [];
        }
        if (data.textSectionList) {
          D.description = data.textSectionList[0].textSection.textSectionContent;
          D.description = D.description.replace(/\{([0-9]*)\}/g, (match, pattern) => {
            return `<a href="http://omim.org/entry/${pattern}">${pattern}</a>`;
          });
          D.description = D.description
            .replace(/\{([0-9]*):([^}]*)\}/g, (match, pattern1, pattern2) => {
              return pattern2;
            });
        }
        if (data.allelicVariantList) {
          D.allelicVariants = data.allelicVariantList.map(e => {
            if (e.allelicVariant.clinvarAccessions) {
              e.allelicVariant.clinvarAccessions = e.allelicVariant.clinvarAccessions.split(';;;');
            }
            return e.allelicVariant;
          });
        }
        D.lastUpdate = new Date();
        resolve(D);
      }).catch((err) => {
        console.log(err);
        reject(err);
      });
  });
};

