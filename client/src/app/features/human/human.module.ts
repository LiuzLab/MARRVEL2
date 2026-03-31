import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { HumanRoutingModule } from './human-routing.module';

import { HumanResultComponent } from '../../components/pages/human-result/human-result.component';
import { SidenavComponent } from '../../components/pages/human-result/sidenav/sidenav.component';
import { OmimComponent } from '../../components/pages/human-result/omim/omim.component';
import { ClinvarComponent } from '../../components/pages/human-result/clinvar/clinvar.component';
import { ClinvarVariantsTableComponent } from '../../components/pages/human-result/clinvar/clinvar-variants-table/clinvar-variants-table.component';
import { GnomADComponent } from '../../components/pages/human-result/gnom-ad/gnom-ad.component';
import { GnomADGeneComponent } from '../../components/pages/human-result/gnom-ad-gene/gnom-ad-gene.component';
import { GnomADGeneVisualComponent } from '../../components/pages/human-result/gnom-ad-gene/gnom-ad-gene-visual/gnom-ad-gene-visual.component';
import { DbnsfpComponent } from '../../components/pages/human-result/dbnsfp/dbnsfp.component';
import { RankscoreVisualComponent } from '../../components/pages/human-result/dbnsfp/rankscore-visual/rankscore-visual.component';
import { DbnsfpScoreCellComponent } from '../../components/pages/human-result/dbnsfp/dbnsfp-score-cell/dbnsfp-score-cell.component';
import { Geno2mpComponent } from '../../components/pages/human-result/geno2mp/geno2mp.component';
import { Geno2mpGeneTableComponent } from '../../components/pages/human-result/geno2mp/geno2mp-gene-table/geno2mp-gene-table.component';
import { Geno2mpVariantTableComponent } from '../../components/pages/human-result/geno2mp/geno2mp-variant-table/geno2mp-variant-table.component';
import { Geno2mpPhenotypePictogramComponent } from '../../components/pages/human-result/geno2mp/geno2mp-phenotype-pictogram/geno2mp-phenotype-pictogram.component';
import { DECIPHERComponent } from '../../components/pages/human-result/decipher/decipher.component';
import { DecipherDiseaseComponent } from '../../components/pages/human-result/decipher/decipher-disease/decipher-disease.component';
import { DgvComponent } from '../../components/pages/human-result/dgv/dgv.component';
import { GtexBoxplotComponent } from '../../components/pages/human-result/gtex-boxplot/gtex-boxplot.component';
import { AgrExpressionComponent } from '../../components/pages/human-result/agr-expression/agr-expression.component';
import { DioptAlignmentComponent } from '../../components/pages/human-result/diopt-alignment/diopt-alignment.component';
import { ProteinDomainComponent } from '../../components/pages/human-result/diopt-alignment/protein-domain/protein-domain.component';
import { PhenotypesComponent } from '../../components/pages/human-result/phenotypes/phenotypes.component';
import { GeneOntologyComponent } from '../../components/pages/human-result/gene-ontology/gene-ontology.component';
import { PharosComponent } from '../../components/pages/human-result/pharos/pharos.component';
import { PharosLigandTableComponent } from '../../components/pages/human-result/pharos/pharos-ligand-table/pharos-ligand-table.component';
import { PdbeComponent } from '../../components/pages/human-result/pdbe/pdbe.component';
import { ForwardAnnotationComponent } from '../../components/pages/human-result/forward-annotation/forward-annotation.component';
import { PrimateComponent } from '../../components/pages/human-result/primate/primate.component';
import { SmartProteinDomainComponent } from '../../components/pages/human-result/smart-protein-domain/smart-protein-domain.component';
import { ModelmatcherComponent } from '../../components/pages/human-result/modelmatcher/modelmatcher.component';
import { PpiComponent } from '../../components/pages/human-result/ppi/ppi.component';
import { HumanProteinStructureComponent } from '../../components/pages/human-result/human-protein-structure/human-protein-structure.component';
import { OrthologsComponent } from '../../components/pages/human-result/orthologs/orthologs.component';
import { AcmgWizardComponent } from '../../components/pages/human-result/acmg-wizard/acmg-wizard.component';
import { ProteinViewerComponent } from '../../components/protein-viewer/protein-viewer.component';
import { ReverseAnnotationCandidatesComponent } from '../../components/reverse-annotation-candidates/reverse-annotation-candidates.component';
import { BatchComponent } from '../../components/pages/batch/batch.component';
import { MultipleGenesComponent } from '../../components/pages/batch/multiple-genes/multiple-genes.component';
import { VcfUploadBoxComponent } from '../../components/vcf-upload-box/vcf-upload-box.component';
import { MultipleGeneBoxComponent } from '../../components/multiple-gene-box/multiple-gene-box.component';

@NgModule({
  declarations: [
    HumanResultComponent,
    SidenavComponent,
    OmimComponent,
    ClinvarComponent,
    ClinvarVariantsTableComponent,
    GnomADComponent,
    GnomADGeneComponent,
    GnomADGeneVisualComponent,
    DbnsfpComponent,
    RankscoreVisualComponent,
    DbnsfpScoreCellComponent,
    Geno2mpComponent,
    Geno2mpGeneTableComponent,
    Geno2mpVariantTableComponent,
    Geno2mpPhenotypePictogramComponent,
    DECIPHERComponent,
    DecipherDiseaseComponent,
    DgvComponent,
    GtexBoxplotComponent,
    AgrExpressionComponent,
    DioptAlignmentComponent,
    ProteinDomainComponent,
    PhenotypesComponent,
    GeneOntologyComponent,
    PharosComponent,
    PharosLigandTableComponent,
    PdbeComponent,
    ForwardAnnotationComponent,
    PrimateComponent,
    SmartProteinDomainComponent,
    ModelmatcherComponent,
    PpiComponent,
    HumanProteinStructureComponent,
    OrthologsComponent,
    ProteinViewerComponent,
    ReverseAnnotationCandidatesComponent,
    BatchComponent,
    MultipleGenesComponent,
    VcfUploadBoxComponent,
    MultipleGeneBoxComponent,
    AcmgWizardComponent,
  ],
  imports: [
    SharedModule,
    HumanRoutingModule,
  ],
})
export class HumanModule {}
