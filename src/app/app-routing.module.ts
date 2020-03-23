import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './services/auth-guard/auth-guard.service';

const routes: Routes = [
  { path: '', redirectTo: 'sign-in', pathMatch: 'full' },
  { path: 'sign-in', loadChildren: () => import('./pages/sign-in/sign-in.module').then( m => m.SignInPageModule)},
  { path: 'landing', loadChildren: () => import('./pages/landing/landing.module').then( m => m.LandingPageModule), canActivate : [AuthGuardService]},
  { path: 'details/:productID', loadChildren: () => import('./pages/details/details.module').then( m => m.DetailsPageModule), canActivate : [AuthGuardService]},
  { path: 'queries', loadChildren: () => import('./pages/queries/queries.module').then( m => m.QueriesPageModule), canActivate : [AuthGuardService]},
  { path: 'about-us', loadChildren: () => import('./pages/about-us/about-us.module').then( m => m.AboutUsPageModule), canActivate : [AuthGuardService]},
  { path: 'items-list/:key', loadChildren: () => import('./pages/items-list/items-list.module').then( m => m.ItemsListPageModule), canActivate : [AuthGuardService]},
  { path: 'profile', loadChildren: () => import('./pages/profile/profile.module').then( m => m.ProfilePageModule), canActivate : [AuthGuardService]},
  { path: 'add-product', loadChildren: () => import('./pages/add-product/add-product.module').then( m => m.AddProductPageModule), canActivate : [AuthGuardService]},
  { path: 'faqs', loadChildren: () => import('./pages/faqs/faqs.module').then( m => m.FaqsPageModule), canActivate : [AuthGuardService]},
  { path: 'order-details', loadChildren: () => import('./pages/order-details/order-details.module').then( m => m.OrderDetailsPageModule), canActivate : [AuthGuardService]},
  { path: 'orders-list/:key', loadChildren: () => import('./pages/orders-list/orders-list.module').then( m => m.OrdersListPageModule), canActivate : [AuthGuardService]},
 
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
