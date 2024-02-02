import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { Country } from 'src/app/model/country.model';
import { OrderItem } from 'src/app/model/order-item.model';
import { Order } from 'src/app/model/order.model';
import { Purchase } from 'src/app/model/purchase.model';
import { State } from 'src/app/model/state.model';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { CustomFormService } from 'src/app/services/form.service';
import { CustomFormValidators } from 'src/app/validators/form.validator';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit, OnDestroy {
  checkoutFormGroup!: FormGroup;
  totalPrice: number = 0;
  totalQuantity: number = 0;
  totalPriceSub: Subscription | undefined;
  totalQuantitySub: Subscription | undefined;
  ccmSub: Subscription | undefined;
  ccySub: Subscription | undefined;
  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];
  countries: Country[] = [];
  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private formService: CustomFormService,
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private router: Router
  ) {}

  ngOnInit(): void {
    //subscribe and populate credit card months;
    this.ccmSub = this.formService
      .getCreditCardMonths(new Date().getMonth() + 1)
      .subscribe((data) => (this.creditCardMonths = data));

    //subscribe and populate credit card years
    this.ccySub = this.formService
      .getCreditCardYears()
      .subscribe((data) => (this.creditCardYears = data));

    this.totalPriceSub = this.cartService.totalPrice.subscribe(
      (data) => (this.totalPrice = data)
    );
    this.totalQuantitySub = this.cartService.totalQuantity.subscribe(
      (data) => (this.totalQuantity = data)
    );

    //create form group
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          CustomFormValidators.notOnlyWhitespace, // odkaz na statickou metodu v form.validator.ts
        ]),
        lastName: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          CustomFormValidators.notOnlyWhitespace,
        ]),
        email: new FormControl('', [
          // netřeba použít notOnlyWhitespace, řeší to pattern
          Validators.required,
          Validators.pattern(
            // pro korektní email (zde i pro doménu druhého řádu) je třeba vytvořit vlastní regex, Validators.email nestačí - je příliš benevolentní, řeší jen př. test@test- 2 stringy dělené @
            '^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,12}(?:.[a-z]{2,4})?$'
          ),
        ]),
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          CustomFormValidators.notOnlyWhitespace,
        ]),
        city: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          CustomFormValidators.notOnlyWhitespace,
        ]),
        country: new FormControl('', [Validators.required]),
        state: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          CustomFormValidators.notOnlyWhitespace,
        ]),
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          CustomFormValidators.notOnlyWhitespace,
        ]),
        city: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          CustomFormValidators.notOnlyWhitespace,
        ]),
        country: new FormControl('', [Validators.required]),
        state: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          CustomFormValidators.notOnlyWhitespace,
        ]),
      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl('', [Validators.required]),
        nameOnCard: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          CustomFormValidators.notOnlyWhitespace,
        ]),
        cardNumber: new FormControl('', [
          Validators.required,
          Validators.pattern('^[0-9]{16}$'),
        ]),
        securityCode: new FormControl('', [
          Validators.required,
          Validators.pattern('^[0-9]{3}$'),
        ]),
        expirationMonth: new FormControl(this.creditCardMonths[0], [Validators.required]),
        expirationYear: new FormControl(this.creditCardYears[0], [Validators.required])
      }),
    });

    /*     this.formService.getCountries().subscribe(data => {
      this.countries = data;
      console.log(this.countries);
    }); - ale uložit subscription do proměnné a v ngOnDestroy hook nezapomenout unsubscribnout*/

    //druhý přístup - bereme jen jedny hodnoty, kanál se uzavře automaticky, netřeba ukládat do subu
    this.formService
      .getCountries()
      .pipe(take(1))
      .subscribe((data) => {
        this.countries = data;
      });
  }

  copyShippingAddressToBillingAddress(event: Event) {
    if ((event.target as HTMLInputElement).checked) {
      // copy shipping address to billing address
      this.checkoutFormGroup.controls['billingAddress'].setValue(
        this.checkoutFormGroup.controls['shippingAddress'].value
      );
      this.billingAddressStates = this.shippingAddressStates;
    } else {
      // reset entire form group if not checked
      this.checkoutFormGroup.controls['billingAddress'].reset();
      this.billingAddressStates = [];
    }
  }
  onChangeYearHandleMonths(event: Event) {
    const selectedYear = +(event.target as HTMLInputElement).value;
    const currentYear = new Date().getFullYear();
    let startMonth: number;

    if (selectedYear === currentYear) {
      startMonth = new Date().getMonth() + 1;
    } else {
      startMonth = 1;
    }
    this.formService
      .getCreditCardMonths(startMonth)
      .subscribe((data) => (this.creditCardMonths = data));
  }

  onCountryChangeHandleStates(formGroupName: string) {
    const formGroup = this.checkoutFormGroup.get(formGroupName);
    const countryCode = formGroup?.value.country.code;
    console.log(
      `Country code: ${countryCode}, country name: ${formGroup?.value.country.name}`
    );
    this.formService
      .getStatesByCountry(countryCode) // subscription je tady k ničemu když potřebujeme nejprve hodnotu country code od uživatele
      .pipe(take(1))
      .subscribe((data) => {
        if (formGroupName === 'shippingAddress') {
          this.shippingAddressStates = data;
        } else {
          this.billingAddressStates = data;
        }
        //select first item by default
        formGroup?.get('state')?.setValue(data[0]);
      });
  }

  onSubmit() {
    console.log('Handling the submit button');
    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched(); // touching all fields triggers the display of the error messages
      return; //error, nevypisovat, nevytvářet purchase objekt a ukončit
    }
    //TODO - create purchase DTO, collect required data from form, add to purchase dto, use checkoutService to call api
    
    //set up order
    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;
    //get cart items
    let cartItems = this.cartService.getCartItems;
    //create orderItems from cartItems
    let orderItems: OrderItem[] = cartItems.map((item) => new OrderItem(item)); // zkrácená verze prto tvorbu pole a pak procházení cartItems a přiřazování -> vytvoří pole a rovnou namapuje values

    //set up purchase + populate with order + orderItems
    const purchase = new Purchase();
    purchase.order = order;
    purchase.orderItems = orderItems;
    //populate purchase with customer data
    purchase.customer = this.checkoutFormGroup.controls['customer'].value;

    //populate purchase with shipping address
    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
    const shippingState: State = JSON.parse(
      JSON.stringify(purchase.shippingAddress.state)
    );
    const shippingCountry: Country = JSON.parse(
      JSON.stringify(purchase.shippingAddress.country)
    );
    purchase.shippingAddress.state = shippingState.name;
    purchase.shippingAddress.country = shippingCountry.name;

    //populate purchase with billing address
    purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
    const billingState: State = JSON.parse(
      JSON.stringify(purchase.billingAddress.state)
    );
    const billingCountry: Country = JSON.parse(
      JSON.stringify(purchase.billingAddress.country)
    );
    purchase.billingAddress.state = billingState.name;
    purchase.billingAddress.country = billingCountry.name;

    //call REST API via the CheckoutService
    this.checkoutService.placeOrder(purchase).subscribe({
      next: (response) => {
        alert(`Your order has been received. \nOrder tracking number: ${response.orderTrackingNumber}`);
        //reset cart
        this.resetCart();
      },
      error: (err) => {
        alert(`There was an error: ${err.message}`);
      },
    });

    console.log(this.checkoutFormGroup.get('customer')?.value);
    console.log(this.checkoutFormGroup.get('shippingAddress')?.value);
    console.log(this.checkoutFormGroup.get('billingAddress')?.value);
    console.log(this.checkoutFormGroup.get('creditCard')?.value);
    console.log('The total price is: ' + this.totalPrice);
    console.log('The total quantity is: ' + this.totalQuantity);
  }
  resetCart() {
    //reset cart data
    this.cartService.setCartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);
    
    //reset the form
    this.checkoutFormGroup.reset();
    //navigate back to the products page
    this.router.navigateByUrl('/products');
  }

  //gettery pro formgroup proměnné - AI genned
  get firstName() {
    return this.checkoutFormGroup.get('customer.firstName');
  }
  get lastName() {
    return this.checkoutFormGroup.get('customer.lastName');
  }
  get email() {
    return this.checkoutFormGroup.get('customer.email');
  }
  get shippingAddressStreet() {
    return this.checkoutFormGroup.get('shippingAddress.street');
  }
  get shippingAddressCity() {
    return this.checkoutFormGroup.get('shippingAddress.city');
  }
  get shippingAddressState() {
    return this.checkoutFormGroup.get('shippingAddress.state');
  }
  get shippingAddressZipCode() {
    return this.checkoutFormGroup.get('shippingAddress.zipCode');
  }
  get shippingAddressCountry() {
    return this.checkoutFormGroup.get('shippingAddress.country');
  }
  get billingAddressStreet() {
    return this.checkoutFormGroup.get('billingAddress.street');
  }
  get billingAddressCity() {
    return this.checkoutFormGroup.get('billingAddress.city');
  }
  get billingAddressState() {
    return this.checkoutFormGroup.get('billingAddress.state');
  }
  get billingAddressZipCode() {
    return this.checkoutFormGroup.get('billingAddress.zipCode');
  }
  get billingAddressCountry() {
    return this.checkoutFormGroup.get('billingAddress.country');
  }
  get creditCardType() {
    return this.checkoutFormGroup.get('creditCard.cardType');
  }
  get creditCardNameOnCard() {
    return this.checkoutFormGroup.get('creditCard.nameOnCard');
  }
  get creditCardNumber() {
    return this.checkoutFormGroup.get('creditCard.cardNumber');
  }
  get creditCardSecurityCode() {
    return this.checkoutFormGroup.get('creditCard.securityCode');
  }
  get creditCardExpirationMonth() {
    return this.checkoutFormGroup.get('creditCard.expirationMonth');
  }
  get creditCardExpirationYear() {
    return this.checkoutFormGroup.get('creditCard.expirationYear');
  }

  ngOnDestroy(): void {
    if (this.ccmSub) {
      this.ccmSub.unsubscribe();
    }
    if (this.ccySub) {
      this.ccySub.unsubscribe();
    }
    if (this.totalPriceSub) {
      this.totalPriceSub.unsubscribe();
    }
    if (this.totalQuantitySub) {
      this.totalQuantitySub.unsubscribe();
    }
  }
}
