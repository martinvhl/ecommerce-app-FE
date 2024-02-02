import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Purchase } from "../model/purchase.model";
import { Observable } from "rxjs";
import { environment } from "src/environment/environment";

@Injectable({
    providedIn: 'root'
})
export class CheckoutService {

    constructor(private httpClient: HttpClient) {}

    placeOrder(purchase: Purchase): Observable<any> {
        return this.httpClient.post<Purchase>(environment.checkoutUrl, purchase);
    }

}