import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Message } from './models/message';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  http: HttpClient = inject(HttpClient);
  fetchMessage() {
    return this.http
      .get(
        'https://restaurant-management-c730d-default-rtdb.firebaseio.com/Messages.json'
      )
      .pipe(
        map((response) => {
          let messages = [];
          for (const key in response) {
            if (response.hasOwnProperty(key)) {
              messages.push({ ...response[key], id: key });
            }
          }
          return messages;
        })
      );
  }
  sendMessage(message: Message) {
    return this.http.post(
      'https://restaurant-management-c730d-default-rtdb.firebaseio.com/Messages.json',
      message
    );
  }
  messageChecked(id: string, isDone: boolean) {
    return this.http.patch(
      'https://restaurant-management-c730d-default-rtdb.firebaseio.com/Messages/' +
        id +
        '.json',
      { isDone: !isDone }
    );
  }
  deleteMessage(id: string) {
    return this.http.delete(
      'https://restaurant-management-c730d-default-rtdb.firebaseio.com/Messages/' +
        id +
        '.json'
    );
  }
}
