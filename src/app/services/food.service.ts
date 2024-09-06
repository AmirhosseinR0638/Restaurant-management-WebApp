import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { NotificationService } from './notification.service';
import { Food } from './models/food';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FoodService {
  http: HttpClient = inject(HttpClient);
  notificationService: NotificationService = inject(NotificationService);
  decreaseRemindNumber(foods: Food[]) {
    //it decrease number of remind food when ordered
    foods.forEach((food) => {
      this.http
        .get(
          'https://restaurant-management-c730d-default-rtdb.firebaseio.com/Foods/' +
            food.id +
            '/remindNumber.json'
        )
        .subscribe({
          next: (remindNumber: number) => {
            this.http
              .patch(
                'https://restaurant-management-c730d-default-rtdb.firebaseio.com/Foods/' +
                  food.id +
                  '.json',
                {
                  remindNumber: --remindNumber,
                }
              )
              .subscribe();
          },
        });
    });
  }
  increaseNumberOfOrderedFood(foods: Food[]) {
    // it increase number of ordered food (it's like score for client)/
    foods.forEach((food) => {
      this.http
        .get(
          'https://restaurant-management-c730d-default-rtdb.firebaseio.com/Foods/' +
            food.id +
            '/numberOfOrdered.json'
        )
        .subscribe({
          next: (numberOfOrdered: number) => {
            this.http
              .patch(
                'https://restaurant-management-c730d-default-rtdb.firebaseio.com/Foods/' +
                  food.id +
                  '.json',
                {
                  numberOfOrdered: ++numberOfOrdered,
                }
              )
              .subscribe();
          },
        });
    });
  }
  addFood(food: Food) {
    return this.http.post(
      'https://restaurant-management-c730d-default-rtdb.firebaseio.com/Foods.json',
      food
    );
  }
  fetchFoodMenu() {
    return this.http
      .get(
        'https://restaurant-management-c730d-default-rtdb.firebaseio.com/Foods.json'
      )
      .pipe(
        map((response) => {
          let foods = [];
          for (const key in response) {
            if (response.hasOwnProperty(key)) {
              foods.push({ ...response[key], id: key });
            }
          }
          return foods;
        })
      );
  }
  editFood(id: string, name: string, price: number, discount: number) {
    return this.http.patch(
      'https://restaurant-management-c730d-default-rtdb.firebaseio.com/Foods/' +
        id +
        '.json',
      {
        name: name,
        price: price,
        discountPercentage: discount,
      }
    );
  }
  deleteFood(id: string) {
    console.log(id);
    return this.http.delete(
      'https://restaurant-management-c730d-default-rtdb.firebaseio.com/Foods/' +
        id +
        '.json'
    );
  }
}
