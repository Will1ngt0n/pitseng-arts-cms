import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ItemsListPageRoutingModule } from './items-list-routing.module';

import { ItemsListPage } from './items-list.page';
import { IonicRatingModule } from 'ionic4-rating';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ItemsListPageRoutingModule,
    IonicRatingModule
  ],
  declarations: [ItemsListPage]
})
export class ItemsListPageModule {}
