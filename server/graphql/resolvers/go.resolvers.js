const GOs = reuqire('../../models/go.model');
const Genes = require('../../models/genes.model');

/**
 * Find Gene Ontology terms by gene Entrez ID
 */
const findByEntrezId = async ({ entrezId }) => {
  try {
    const gene = await Genes.findOne({ entrezId }, '-_id gos')
      .populate('gos.ontology');
    if (!gene || !gene.gos) {
      return [];
    }

    return gene.gos.map((go) => ({
      goId: go.goId,
      eviCode: go.eviCode,
      date: go.date,
      assignedBy: go.assignedBy,
      ontology: go.ontology
    }));
  } catch (error) {
    console.error('Error fetching GOs by Entrez ID:', error);
    throw new Error('Failed to fetch GOs by Entrez ID');
  }
};

module.exports = {
  findByEntrezId
};
