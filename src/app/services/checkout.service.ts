import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Purchase } from "../model/purchase.model";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { PaymentInfo } from "../model/payment-info";

@Injectable({
    providedIn: 'root'
})
export class CheckoutService {

    constructor(private httpClient: HttpClient) {}

    placeOrder(purchase: Purchase): Observable<any> {
        return this.httpClient.post<Purchase>(environment.checkoutUrl, purchase);
    }

    
    /**
     * REST API call to our BE to call Stripe API to create a PaymentIntent with our payment info
     *
     * @param {PaymentInfo} paymentInfo - information about the payment
     * @return {Observable<any>} an observable with PaymentIntent JSON from BE/Stripe
     */
    createPaymentIntent(paymentInfo: PaymentInfo): Observable<any> {
        return this.httpClient.post<PaymentInfo>(environment.paymentIntentUrl, paymentInfo);
    }

}