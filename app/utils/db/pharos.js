const Promise = require('bluebird');

const PharosLigands = require('../../models/pharos-ligands.model');
const PharosDrugs = require('../../models/pharos-drugs.model');
const PharosTargets = require('../../models/pharos-targets.model');
const Genes = require('../../models/genes.model');

const getTargetsByEntrezId = (entrezId) => {
  return new Promise((resolve, reject) => {
    Genes.findOne({ entrezId: parseInt(entrezId) }, { 'pharosTargetIds': 1 })
      .populate({
        path: 'pharosTargets',
        select: 'id deprecated name accession gene description idgFamily idgTDL drugIds ligandIds -_id',
        populate: [
          { path: 'drugs', select: '-_id' },
          { path: 'ligands', select: '-_id' }
        ]
      })
      .lean()
      .then(doc => {
        if (!doc || !doc.pharosTargets) {
          resolve([]);
        } else {
          resolve(doc.pharosTargets);
        }
      }).catch(err => {
        reject(err);
      });
  });
};

const extractTargetFromLigandInfo = (targetId, ligands) => {
  for (var i=0; i<ligands.length; ++i) {
    const ligand = ligands[i];
    var targetCount = 0;
    ligand.targetProperties = [];
    if (ligand.links && ligand.links.length) {
      for (var j=0; j<ligand.links.length; ++j) {
        const link = ligand.links[j];
        if (link.kind === 'ix.idg.models.Target') {
          ++targetCount;
          if (parseInt(link.refid) === targetId) {
            for (var k=0; k<link.properties.length; ++k) {
              const property = link.properties[k];
              if (property.label === 'IDG Target') {
                ligand.idgTarget = property.term;
              } else if (property.label === 'IDG Target Family') {
                ligand.idgTargetFamily = property.term;
              } else if (property.label === 'IDG Development Level') {
                ligand.idgDevLevel = property.term;
              } else if (property.label.indexOf('Ligand Activity') === -1) {
                ligand.targetProperties.push(property);
              }
            }
          }
        }
      }
    }
    ligand.targetCount = targetCount;
  }
};

const getDrugsLigandsByEntrezId = (entrezId) => {
  return new Promise((resolve, reject) => {
    getTargetsByEntrezId(entrezId)
      .map(aTarget => {
        delete aTarget.drugIds;
        delete aTarget.ligandIds;
        if (aTarget.drugs && aTarget.drugs.length) {
          extractTargetFromLigandInfo(aTarget.id, aTarget.drugs);
        }
        if (aTarget.ligands && aTarget.ligands.length) {
          extractTargetFromLigandInfo(aTarget.id, aTarget.ligands);
        }
        return aTarget;
      }).then(docs => {
        resolve(docs);
      }).catch((err) => {
        reject(err);
      });
  });
};

exports.getDrugsLigandsByEntrezId = getDrugsLigandsByEntrezId;

