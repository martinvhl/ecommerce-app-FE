import { Injectable } from '@angular/core';
import { CartItem } from '../model/cart-item.model';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CartService {
  private cartItems: CartItem[] = [];

  //publish events to all subscriber (Publisher-Subscriber pattern)
  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();

  addToCart(theCartItem: CartItem) {
    //check if we already have the item in the cart
    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem | undefined = undefined;

    if (this.cartItems.length > 0) {
      //metoda Array.find() projde pole a vrátí první element co odpovídá podmínce / undefined když nic nevyhovuje
      existingCartItem = this.cartItems.find(
        (tempCartItem) => tempCartItem.id === theCartItem.id
      );
      //check if we found it
      alreadyExistsInCart = !!existingCartItem; //(existingCartItem != undefined)
    }

    if (alreadyExistsInCart) {
      //cart item už je v košíku, jen zvýšíme quantity
      existingCartItem!.quantity++; //existingCartItem ošetřeno výše, ale vyžaduje to non-null assertion (jinak quantity++ nebude fungovat)
    } else {
      //přidáme cart item do košíku
      this.cartItems.push(theCartItem);
    }

    //compute cart quantity and cart total
    this.computeCartTotals();
  }
  decrementQuantity(theCartItem: CartItem) {
    //first we have to decrement the quantity
    theCartItem.quantity--;

    //check if the quantity=0 -> remove the item from the cart
    if (theCartItem.quantity === 0) {
      this.remove(theCartItem);
    } else {
      //if not, we have to compute the cart total again
      this.computeCartTotals();
    }
  }
  remove(theCartItem: CartItem) {
    //get index of item in the array
    const itemIndex = this.cartItems.findIndex(
      (tempCartItem) => tempCartItem.id === theCartItem.id
    );
    //if found, remove the item from the array at the given index
    if (itemIndex > -1) {
      this.cartItems.splice(itemIndex, 1);
      this.computeCartTotals();
    }
  }

  computeCartTotals() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for (let currentCartItem of this.cartItems) {
      totalPriceValue += currentCartItem.unitPrice * currentCartItem.quantity;
      totalQuantityValue += currentCartItem.quantity;
    }

    //publish the new values -> all subscribers will receive the new data
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    //log cart data for debugging purposes
    this.logCartData(totalPriceValue, totalQuantityValue);
  }

  logCartData(totalPriceValue: number, totalQuantityValue: number) {
    console.log('Contents of the cart:');
    for (let tempCartItem of this.cartItems) {
      const subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;
      console.log(
        `Item name: ${tempCartItem.name}, quantity: ${tempCartItem.quantity} per $${tempCartItem.unitPrice}. Subtotal: $${subTotalPrice}`
      );
    }

    console.log(
      `Total number of items in cart: ${totalQuantityValue}, total price: ${totalPriceValue.toFixed(
        2
      )}` //na 2 desetinná místa
    );
    console.log('--------------------------------------------');
  }

  get getCartItems() {
    return this.cartItems;
  }
}
