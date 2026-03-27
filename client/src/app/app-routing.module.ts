import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './components/pages/home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },

  {
    path: 'human',
    loadChildren: () => import('./features/human/human.module').then(m => m.HumanModule),
  },
  {
    path: 'search/human',
    loadChildren: () => import('./features/human-search/human-search.module').then(m => m.HumanSearchModule),
  },
  {
    path: 'model',
    loadChildren: () => import('./features/model/model.module').then(m => m.ModelModule),
  },
  {
    path: 'about',
    loadChildren: () => import('./features/about/about.module').then(m => m.AboutModule),
  },
  {
    path: 'faq',
    loadChildren: () => import('./features/faq/faq.module').then(m => m.FaqModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
