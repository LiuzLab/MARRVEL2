import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HumanResultComponent } from '../../components/pages/human-result/human-result.component';
import { ReverseAnnotationCandidatesComponent } from '../../components/reverse-annotation-candidates/reverse-annotation-candidates.component';
import { BatchComponent } from '../../components/pages/batch/batch.component';
import { MultipleGenesComponent } from '../../components/pages/batch/multiple-genes/multiple-genes.component';

const routes: Routes = [
  { path: 'gene/:gene', component: HumanResultComponent },
  { path: 'variant/:variant', component: HumanResultComponent },
  { path: 'variant/hg38/:variant', component: HumanResultComponent },
  { path: 'gene/:gene/variant/:variant', component: HumanResultComponent },
  { path: 'gene/:gene/variant/hg38/:variant', component: HumanResultComponent },
  { path: 'protein', redirectTo: '/', pathMatch: 'full' },
  { path: 'protein/:protein', component: ReverseAnnotationCandidatesComponent },
  { path: 'protein/:protein/gene/:gene/variant/:variant', component: HumanResultComponent },
  { path: 'batch/vcf', component: BatchComponent },
  { path: 'batch/genes', component: MultipleGenesComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HumanRoutingModule {}
