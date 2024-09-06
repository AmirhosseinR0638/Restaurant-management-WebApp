import { inject, Injectable } from '@angular/core';
import { Order } from './models/order';
import { map } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  http: HttpClient = inject(HttpClient);
  orders: Order[] = [];
  fetchOrders() {
    return this.http
      .get(
        'https://restaurant-management-c730d-default-rtdb.firebaseio.com/Orders.json'
      )
      .pipe(
        map((response) => {
          this.orders = [];
          for (const key in response) {
            if (response.hasOwnProperty(key)) {
              this.orders.push({ ...response[key], id: key });
            }
          }
          return this.orders;
        })
      );
  }
  orderFood(order: Order) {
    return this.http.post(
      'https://restaurant-management-c730d-default-rtdb.firebaseio.com/Orders.json',
      order
    );
  }
  deleteOrder(id: string) {
    console.log(id);
    return this.http.delete(
      'https://restaurant-management-c730d-default-rtdb.firebaseio.com/Orders/' +
        id +
        '.json'
    );
  }
}
