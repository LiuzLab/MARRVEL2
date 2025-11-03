const DIOPTAlignments = require('../../models/diopt-alignments.model');
const DIOPTOrtholog = require('../../models/diopt-ortholog.model');
const Genes = require('../../models/genes.model');

/**
 * Process alignment styles
 */
const processAlignmentStyles = (data) => {
  for (let i = 0; i < data.length; ++i) {
    const style = data[i].style;
    if (!style) continue;

    for (let j = 0; j < style.length; ++j) {
      let clsStr = '';
      if (style[j].indexOf('color: blue') !== -1) {
        clsStr = 'mark-colon';
      } else if (style[j].indexOf('color: red') !== -1) {
        clsStr = 'mark-asterisk';
      } else if (style[j].indexOf('color: purple') === -1) {
        clsStr = 'mark-dot';
      }
      style[j] = clsStr;
    }
  }
};

/**
 * Find DIOPT alignments by Entrez ID
 */
const findAlignmentsByEntrezId = async ({ entrezId }) => {
  try {
    const doc = await DIOPTAlignments.findOne({ entrezId }, { _id: 0 }).lean();

    if (doc && doc.data) {
      processAlignmentStyles(doc.data);
    }

    return doc;
  } catch (error) {
    console.error('Error fetching DIOPT alignments by Entrez ID:', error);
    throw new Error('Failed to fetch DIOPT alignments by Entrez ID');
  }
};

/**
 * Find DIOPT domains by Entrez ID
 */
const findDomainsByEntrezId = async ({ entrezId }) => {
  try {
    const gene = await Genes.findOne({ entrezId }, '-_id -clinVarIds -dgvIds -geno2mpIds')
      .populate('dioptDomains', '-_id')
      .lean();

    if (!gene) {
      return { entrezId, domains: [] };
    }

    return {
      entrezId,
      domains: gene.dioptDomains || []
    };
  } catch (error) {
    console.error('Error fetching DIOPT domains by Entrez ID:', error);
    throw new Error('Failed to fetch DIOPT domains by Entrez ID');
  }
};

/**
 * Find DIOPT orthologs by Entrez ID
 */
const findOrthologsByEntrezId = async ({ entrezId }) => {
  try {
    const docs = await DIOPTOrtholog.find({ entrezId1: entrezId }, { _id: 0 })
      .populate({
        path: 'gene2',
        select: '-_id -clinVarIds -dgvIds -geno2mpIds',
        populate: [
          {
            path: 'phenotypes.ontology',
            select: '-_id'
          },
          {
            path: 'impcPhenotypes',
            select: '-_id',
            populate: {
              path: 'phenotype',
              select: '-_id'
            }
          },
          {
            path: 'gos.ontology',
            select: '-_id'
          }
        ],
      })
      .populate({ path: 'gene1', select: '-_id -clinVarIds -dgvIds -geno2mpIds' })
      .lean();

    // Filter out entries where gene2 is null
    return docs.filter(doc => doc.gene2 != null);
  } catch (error) {
    console.error('Error fetching DIOPT orthologs by Entrez ID:', error);
    throw new Error('Failed to fetch DIOPT orthologs by Entrez ID');
  }
};

module.exports = {
  findAlignmentsByEntrezId,
  findDomainsByEntrezId,
  findOrthologsByEntrezId
};
