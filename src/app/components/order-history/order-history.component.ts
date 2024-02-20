import { Component, OnInit } from '@angular/core';
import { OrderHistory } from '../../model/order-history.model';
import { OrderHistoryService } from '../../services/order-history.service';
import { map, take, tap } from 'rxjs';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css'],
})
export class OrderHistoryComponent implements OnInit {
  protected orderHistoryList: OrderHistory[] = [];
  storage: Storage = sessionStorage;

  constructor(private orderHistoryService: OrderHistoryService) {}

  ngOnInit(): void {
    this.handleOrderHistory();
  }

  handleOrderHistory() {
    const theEmail = JSON.parse(this.storage.getItem('userEmail')!); // ! order-history komponent je na guarded routě -> bez přihlášení se na něj nelze dostat -> přihlášení = uložení mailui do session storage
    this.orderHistoryService
      .getOrderHistory(theEmail)
      .pipe(
        take(1), // order history se nebude měniít v čase, kdy má uživatel otevřené okno s komponentem order history - stačí jen take(1) a hned zase unsub, nemusíme držet subscribe déle (jinak bychom museli přidat subscription a implementovat ondestroy, aby se nám tu nekupily suby)
        map((data) => (this.orderHistoryList = data._embedded.orders))
        )
        .subscribe();
  }
}
