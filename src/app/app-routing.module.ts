import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './components/pages/home/home.component';
import { AboutComponent } from './components/pages/about/about.component';
import { HumanResultComponent } from './components/pages/human-result/human-result.component';
import { BatchComponent } from './components/pages/batch/batch.component';
import { MultipleGenesComponent } from './components/pages/batch/multiple-genes/multiple-genes.component';

// TODO: Remove below
import { GtexBoxplotComponent } from './components/pages/human-result/gtex-boxplot/gtex-boxplot.component';
import { ReverseAnnotationCandidatesComponent } from './components/reverse-annotation-candidates/reverse-annotation-candidates.component';

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'human/gene/:gene', component: HumanResultComponent },
  { path: 'human/variant/:variant', component: HumanResultComponent },
  { path: 'human/gene/:gene/variant/:variant', component: HumanResultComponent },

  { path: 'human/protein/:protein', component: ReverseAnnotationCandidatesComponent },
  { path: 'human/protein/:protein/gene/:gene/variant/:variant', component: HumanResultComponent },

  { path: 'human/batch/vcf', component: BatchComponent },
  { path: 'human/batch/genes', component: MultipleGenesComponent },

  { path: 'about', component: AboutComponent },

  { path: 'plot', component: GtexBoxplotComponent },    // TO DO: remove this

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
