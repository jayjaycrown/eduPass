import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateListPageRoutingModule } from './create-list-routing.module';

import { CreateListPage } from './create-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    CreateListPageRoutingModule
  ],
  declarations: [CreateListPage]
})
export class CreateListPageModule {}
