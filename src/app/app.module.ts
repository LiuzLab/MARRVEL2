import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HighlightSearch } from './highlight';

import {
  MatButtonModule,
  MatInputModule,
  MatFormFieldModule,
  MatSelectModule,
  MatIconModule,
  MatDividerModule,
  MatToolbarModule,
  MatSidenavModule,
  MatTooltipModule,
  MatChipsModule,
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
  MatSlideToggleModule,
  MatProgressBarModule,
  MatExpansionModule,
  MatRadioModule,
  MatDialogModule,
  MatCheckboxModule,
  MatRippleModule
} from '@angular/material';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/pages/home/home.component';

import { SearchBoxComponent } from './components/search-box/search-box.component';
import { MailchimpComponent } from './components/mailchimp/mailchimp.component';
import { AboutComponent } from './components/pages/about/about.component';
import { FooterComponent } from './components/footer/footer.component';
import { HumanResultComponent } from './components/pages/human-result/human-result.component';
import { SidenavComponent } from './components/pages/human-result/sidenav/sidenav.component';
import { OmimComponent } from './components/pages/human-result/omim/omim.component';
import { UnitDirective } from './directives/unit.directive';
import { FilterInputComponent } from './components/filter-input/filter-input.component';
import { BasicDatatableComponent } from './components/basic-datatable/basic-datatable.component';
import { ClinvarComponent } from './components/pages/human-result/clinvar/clinvar.component';
import { ScrollTopButtonComponent } from './components/scroll-top-button/scroll-top-button.component';
import { GnomADComponent } from './components/pages/human-result/gnom-ad/gnom-ad.component';
import { GnomADGeneComponent } from './components/pages/human-result/gnom-ad-gene/gnom-ad-gene.component';
import { GnomADGeneVisualComponent } from './components/pages/human-result/gnom-ad-gene/gnom-ad-gene-visual/gnom-ad-gene-visual.component';
import { DbnsfpComponent } from './components/pages/human-result/dbnsfp/dbnsfp.component';
import { RankscoreVisualComponent } from './components/pages/human-result/dbnsfp/rankscore-visual/rankscore-visual.component';
import { DbnsfpScoreCellComponent } from './components/pages/human-result/dbnsfp/dbnsfp-score-cell/dbnsfp-score-cell.component';
import { Geno2mpComponent } from './components/pages/human-result/geno2mp/geno2mp.component';
import { DECIPHERComponent } from './components/pages/human-result/decipher/decipher.component';
import { DgvComponent } from './components/pages/human-result/dgv/dgv.component';
import { Geno2mpGeneTableComponent } from './components/pages/human-result/geno2mp/geno2mp-gene-table/geno2mp-gene-table.component';
import { Geno2mpVariantTableComponent } from './components/pages/human-result/geno2mp/geno2mp-variant-table/geno2mp-variant-table.component';
import { Geno2mpPhenotypePictogramComponent } from './components/pages/human-result/geno2mp/geno2mp-phenotype-pictogram/geno2mp-phenotype-pictogram.component';
import { PhenotypesComponent } from './components/pages/human-result/phenotypes/phenotypes.component';
import { GeneOntologyComponent } from './components/pages/human-result/gene-ontology/gene-ontology.component';
import { VcfUploadBoxComponent } from './components/vcf-upload-box/vcf-upload-box.component';
import { BatchComponent } from './components/pages/batch/batch.component';
import { DioptAlignmentComponent } from './components/pages/human-result/diopt-alignment/diopt-alignment.component';
import { ProteinDomainComponent } from './components/pages/human-result/diopt-alignment/protein-domain/protein-domain.component';
import { DecipherDiseaseComponent } from './components/pages/human-result/decipher/decipher-disease/decipher-disease.component';
import { GtexBoxplotComponent } from './components/pages/human-result/gtex-boxplot/gtex-boxplot.component';
import { AgrExpressionComponent } from './components/pages/human-result/agr-expression/agr-expression.component';
import { MultipleGeneBoxComponent } from './components/multiple-gene-box/multiple-gene-box.component';
import { MultipleGenesComponent } from './components/pages/batch/multiple-genes/multiple-genes.component';
import { ReverseAnnotationCandidatesComponent } from './components/reverse-annotation-candidates/reverse-annotation-candidates.component';
import { PharosComponent } from './components/pages/human-result/pharos/pharos.component';
import { PharosLigandTableComponent } from './components/pages/human-result/pharos/pharos-ligand-table/pharos-ligand-table.component';
import { FaqComponent } from './components/pages/faq/faq.component';
import { ModelGeneSearchComponent } from './components/search-box/model-gene-search/model-gene-search.component';
import { ModelGeneHumanOrthologsComponent } from './components/model-gene-human-orthologs/model-gene-human-orthologs.component';
import { OrthologsComponent } from './components/pages/human-result/orthologs/orthologs.component';
import { YoutubeDialogComponent } from './components/search-box/search-box.component';
import { ClickOutsideDirective } from './directives/click-outside.directive';
import { ClinvarVariantsTableComponent } from './components/pages/human-result/clinvar/clinvar-variants-table/clinvar-variants-table.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    SearchBoxComponent,
    MailchimpComponent,
    AboutComponent,
    FooterComponent,
    HumanResultComponent,
    SidenavComponent,
    OmimComponent,
    UnitDirective,
    FilterInputComponent,
    HighlightSearch,
    BasicDatatableComponent,
    ClinvarComponent,
    ScrollTopButtonComponent,
    GnomADComponent,
    GnomADGeneComponent,
    GnomADGeneVisualComponent,
    DbnsfpComponent,
    RankscoreVisualComponent,
    DbnsfpScoreCellComponent,
    Geno2mpComponent,
    DECIPHERComponent,
    DgvComponent,
    Geno2mpGeneTableComponent,
    Geno2mpVariantTableComponent,
    Geno2mpPhenotypePictogramComponent,
    PhenotypesComponent,
    GeneOntologyComponent,
    VcfUploadBoxComponent,
    BatchComponent,
    DioptAlignmentComponent,
    ProteinDomainComponent,
    DecipherDiseaseComponent,
    GtexBoxplotComponent,
    AgrExpressionComponent,
    MultipleGeneBoxComponent,
    MultipleGenesComponent,
    ReverseAnnotationCandidatesComponent,
    PharosComponent,
    PharosLigandTableComponent,
    FaqComponent,
    ModelGeneSearchComponent,
    ModelGeneHumanOrthologsComponent,
    OrthologsComponent,
    YoutubeDialogComponent,
    ClickOutsideDirective,
    ClinvarVariantsTableComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,

    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatToolbarModule,
    MatDividerModule,
    MatSidenavModule,
    MatTooltipModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSlideToggleModule,
    MatProgressBarModule,
    MatExpansionModule,
    MatRadioModule,
    MatDialogModule,
    MatCheckboxModule,
    MatRippleModule
  ],
  exports: [
    MatButtonModule,
    HighlightSearch
  ],
  entryComponents: [
    YoutubeDialogComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
