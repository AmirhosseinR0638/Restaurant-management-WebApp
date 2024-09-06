import { inject, Injectable } from '@angular/core';
import { Client } from './models/client';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  clients: Client[] = [];
  http: HttpClient = inject(HttpClient);
  createClientAccount(client: Client) {
    return this.http.post(
      'https://restaurant-management-c730d-default-rtdb.firebaseio.com/Clients.json',
      client
    );
  }
  fetchClientsAccounts() {
    this.clients = [];
    return this.http
      .get(
        'https://restaurant-management-c730d-default-rtdb.firebaseio.com/Clients.json'
      )
      .pipe(
        map((response) => {
          for (const key in response) {
            if (response.hasOwnProperty(key)) {
              this.clients.push({ ...response[key], id: key });
            }
          }
          return this.clients;
        })
      );
  }
  editClientAccount(
    id: string,
    clientFirstName: string,
    clientLastName: string,
    clientAddress: string,
    clientPhoneNumber: string
  ) {
    return this.http.patch(
      'https://restaurant-management-c730d-default-rtdb.firebaseio.com/Clients/' +
        id +
        '.json',
      {
        firstName: clientFirstName,
        lastName: clientLastName,
        address: clientAddress,
        phoneNumber: clientPhoneNumber,
      }
    );
  }
  deleteClientAccount(id: string) {
    return this.http.delete(
      'https://restaurant-management-c730d-default-rtdb.firebaseio.com/Clients/' +
        id +
        '.json'
    );
  }
  increaseAmountOfClientOrder(
    firstName: string,
    lastName: string,
    price: number
  ) {
    //it increase amount of client's order(it's like score for client)
    this.clients = [];
    this.fetchClientsAccounts().subscribe({
      next: (clients) => {
        this.clients = clients;
        let client = this.clients.find((client) => {
          return client.firstName == firstName && client.lastName == lastName;
        });
        client.amountOfOrders += price;
        this.http
          .put(
            'https://restaurant-management-c730d-default-rtdb.firebaseio.com/Clients/' +
              client.id +
              '.json',
            client
          )
          .subscribe();
      },
    });
  }
}
