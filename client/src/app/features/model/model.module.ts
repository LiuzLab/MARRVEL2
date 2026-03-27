import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { ModelGeneHumanOrthologsComponent } from '../../components/model-gene-human-orthologs/model-gene-human-orthologs.component';

const routes: Routes = [
  { path: 'gene', redirectTo: '/', pathMatch: 'full' },
  { path: 'gene/:gene', component: ModelGeneHumanOrthologsComponent },
];

@NgModule({
  declarations: [ModelGeneHumanOrthologsComponent],
  imports: [SharedModule, RouterModule.forChild(routes)],
})
export class ModelModule {}
