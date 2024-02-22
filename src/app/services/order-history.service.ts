import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { OrderHistory } from "../model/order-history.model";
import { environment } from "src/environments/environment";

interface GetResponseOrderHistory {
    _embedded: {
        orders: OrderHistory[];
    }
}

@Injectable({
    providedIn: 'root'
})
export class OrderHistoryService {

    constructor(private httpClient: HttpClient) {

    }

    getOrderHistory(theEmail: string): Observable<GetResponseOrderHistory> {
        return this.httpClient.get<GetResponseOrderHistory>(`${environment.orderHistoryByEmailUrl}${theEmail}`);
    }
}