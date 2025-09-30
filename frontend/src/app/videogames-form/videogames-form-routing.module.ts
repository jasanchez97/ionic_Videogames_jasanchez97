import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VideogamesFormPage } from './videogames-form.page';

const routes: Routes = [
  {
    path: '',
    component: VideogamesFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class VideogamesFormPageRoutingModule {}
