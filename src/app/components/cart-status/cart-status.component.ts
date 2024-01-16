import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-status',
  templateUrl: './cart-status.component.html',
  styleUrls: ['./cart-status.component.css'],
})
export class CartStatusComponent implements OnInit, OnDestroy {
  totalPrice: number = 0.0;
  totalQuantity: number = 0;
  totalPriceSub!: Subscription;
  totalQuantitySub!: Subscription;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.totalPriceSub = this.cartService.totalPrice.subscribe(
      (data) => (this.totalPrice = data)
    );
    this.totalQuantitySub = this.cartService.totalQuantity.subscribe(
      (data) => (this.totalQuantity = data)
    );
  }

  ngOnDestroy(): void {
    this.totalPriceSub.unsubscribe();
    this.totalQuantitySub.unsubscribe();
  }
}
