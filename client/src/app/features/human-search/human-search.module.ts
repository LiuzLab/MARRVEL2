import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { HumanSearchComponent } from '../../components/pages/human-search/human-search.component';

const routes: Routes = [{ path: '', component: HumanSearchComponent }];

@NgModule({
  declarations: [HumanSearchComponent],
  imports: [SharedModule, RouterModule.forChild(routes)],
})
export class HumanSearchModule {}
