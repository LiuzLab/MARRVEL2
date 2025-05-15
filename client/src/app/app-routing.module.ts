import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './components/pages/home/home.component';
import { AboutComponent } from './components/pages/about/about.component';
import { FaqComponent } from './components/pages/faq/faq.component';
import { HumanResultComponent } from './components/pages/human-result/human-result.component';
import { BatchComponent } from './components/pages/batch/batch.component';
import { MultipleGenesComponent } from './components/pages/batch/multiple-genes/multiple-genes.component';
import { HumanSearchComponent } from './components/pages/human-search/human-search.component';
import { ReverseAnnotationCandidatesComponent } from './components/reverse-annotation-candidates/reverse-annotation-candidates.component';
import { ModelGeneHumanOrthologsComponent } from './components/model-gene-human-orthologs/model-gene-human-orthologs.component';

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },

  { path: 'human/gene/:gene', component: HumanResultComponent },
  { path: 'human/variant/:variant', component: HumanResultComponent },
  { path: 'human/variant/hg38/:variant', component: HumanResultComponent },
  { path: 'human/gene/:gene/variant/:variant', component: HumanResultComponent },
  { path: 'human/gene/:gene/variant/hg38/:variant', component: HumanResultComponent },

  { path: 'search/human', component: HumanSearchComponent },

  { path: 'human/protein', component: HomeComponent },
  { path: 'human/protein/:protein', component: ReverseAnnotationCandidatesComponent },
  { path: 'human/protein/:protein/gene/:gene/variant/:variant', component: HumanResultComponent },

  { path: 'model/gene', component: HomeComponent },
  { path: 'model/gene/:gene', component: ModelGeneHumanOrthologsComponent },

  { path: 'human/batch/vcf', component: BatchComponent },
  { path: 'human/batch/genes', component: MultipleGenesComponent },

  { path: 'about', component: AboutComponent },

  { path: 'faq', component: FaqComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
