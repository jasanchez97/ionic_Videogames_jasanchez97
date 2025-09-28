import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'videogames',
    loadChildren: () => import('./videogames/videogames.module').then( m => m.VideogamesPageModule)
  },
  {
    path: 'videogames-form',
    loadChildren: () => import('./videogames-form/videogames-form.module').then( m => m.VideogamesFormPageModule)
  },
  {
    path: 'videogames-form/:id',
    loadChildren: () => import('./videogames-form/videogames-form.module').then( m => m.VideogamesFormPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }