import { Injector, NgModule } from '@angular/core';
import { Router, RouterModule, Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { CartDetailsComponent } from './components/cart-details/cart-details.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { OktaAuthGuard, OktaCallbackComponent } from '@okta/okta-angular';
import { LoginComponent } from './components/login/login.component';
import { MembersPageComponent } from './components/members-page/members-page.component';
import { OrderHistoryComponent } from './components/order-history/order-history.component';
import { OktaAuth } from '@okta/okta-auth-js';

const routes: Routes = [
  //záleží na pořadí
  { path: 'login/callback', component: OktaCallbackComponent}, // OktaCallbackComponent - po úspěšné autentizaci dojde k přesměrování na dané URI v naší aplikaci (bez nutnosti low-level kódování)
  { path: 'login', component: LoginComponent },
  { path: 'members', component: MembersPageComponent, canActivate: [OktaAuthGuard], data: {onAuthRequired: sendToLoginPage} },
  { path: 'order-history', component: OrderHistoryComponent, canActivate: [OktaAuthGuard], data: {onAuthRequired: sendToLoginPage} },
  { path: 'search/:searchText', component: ProductListComponent },
  { path: 'category/:id', component: ProductListComponent },
  { path: 'category', component: ProductListComponent },
  { path: 'products/:id', component: ProductDetailsComponent },
  { path: 'products', component: ProductListComponent },
  { path: 'cart-details', component: CartDetailsComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: '', redirectTo: '/products', pathMatch: 'full' },
  { path: '**', redirectTo: '/products', pathMatch: 'full' }, // wildcard
];

//callback pro OktaAuthGuard -> není přihlášen, hoď ho na login page
function sendToLoginPage(oktaAuth: OktaAuth, injector: Injector) {
  //Use injector to access any service available within your application
  const router = injector.get(Router);
  //Redirect the user to your custom login page
  router.navigate(['/login']);
}

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}