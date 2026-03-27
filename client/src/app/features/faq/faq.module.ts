import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { FaqComponent } from '../../components/pages/faq/faq.component';

const routes: Routes = [{ path: '', component: FaqComponent }];

@NgModule({
  declarations: [FaqComponent],
  imports: [SharedModule, RouterModule.forChild(routes)],
})
export class FaqModule {}
