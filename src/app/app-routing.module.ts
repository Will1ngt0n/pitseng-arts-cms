import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'landing', pathMatch: 'full' },
  { path: 'sign-in', loadChildren: () => import('./pages/sign-in/sign-in.module').then( m => m.SignInPageModule)},
  { path: 'landing', loadChildren: () => import('./pages/landing/landing.module').then( m => m.LandingPageModule)},
  { path: 'details/:productID', loadChildren: () => import('./pages/details/details.module').then( m => m.DetailsPageModule)},
  { path: 'queries', loadChildren: () => import('./pages/queries/queries.module').then( m => m.QueriesPageModule)},
  { path: 'about-us', loadChildren: () => import('./pages/about-us/about-us.module').then( m => m.AboutUsPageModule)},
  { path: 'items-list/:key', loadChildren: () => import('./pages/items-list/items-list.module').then( m => m.ItemsListPageModule)},
  { path: 'profile', loadChildren: () => import('./pages/profile/profile.module').then( m => m.ProfilePageModule)},
  { path: 'add-product', loadChildren: () => import('./pages/add-product/add-product.module').then( m => m.AddProductPageModule)},
  { path: 'faqs', loadChildren: () => import('./pages/faqs/faqs.module').then( m => m.FaqsPageModule)},
  { path: 'order-details', loadChildren: () => import('./pages/order-details/order-details.module').then( m => m.OrderDetailsPageModule)},
  { path: 'orders-list/:key', loadChildren: () => import('./pages/orders-list/orders-list.module').then( m => m.OrdersListPageModule)},
  { path: 'users-orders',loadChildren: () => import('./pages/users-orders/users-orders.module').then( m => m.UsersOrdersPageModule)},
 ,


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
