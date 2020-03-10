import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UsersOrdersPage } from './users-orders.page';

const routes: Routes = [
  {
    path: '',
    component: UsersOrdersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersOrdersPageRoutingModule {}
