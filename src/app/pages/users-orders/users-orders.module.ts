import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UsersOrdersPageRoutingModule } from './users-orders-routing.module';

import { UsersOrdersPage } from './users-orders.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UsersOrdersPageRoutingModule
  ],
  declarations: [UsersOrdersPage]
})
export class UsersOrdersPageModule {}
