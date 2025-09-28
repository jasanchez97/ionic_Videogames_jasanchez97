import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VideogamesFormPageRoutingModule } from './videogames-form-routing.module';

import { VideogamesFormPage } from './videogames-form.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    VideogamesFormPageRoutingModule
  ],
  declarations: [VideogamesFormPage]
})
export class VideogamesFormPageModule {}
