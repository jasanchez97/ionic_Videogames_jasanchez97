import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VideogamesPage } from './videogames.page';

const routes: Routes = [
  {
    path: '',
    component: VideogamesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VideogamesPageRoutingModule {}
