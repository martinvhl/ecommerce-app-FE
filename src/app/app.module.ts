import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CartDetailsComponent } from './components/cart-details/cart-details.component';
import { CartStatusComponent } from './components/cart-status/cart-status.component';
import { ProductCategoryMenuComponent } from './components/product-category-menu/product-category-menu.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { SearchComponent } from './components/search/search.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { InvalidControlScrollDirective } from './directives/invalid-scroll.directive';

@NgModule({
  declarations: [AppComponent, ProductListComponent, ProductCategoryMenuComponent, SearchComponent, ProductDetailsComponent, CartStatusComponent, CartDetailsComponent, CheckoutComponent, InvalidControlScrollDirective],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, ReactiveFormsModule, NgbModule], // ngbmodule - pro ng-bootstrap - pagination, ale i další widgety
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
