import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from './notification.service';
import { BehaviorSubject, map } from 'rxjs';
import { Cashier } from './models/cashier';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root',
})
export class CashierService {
  cashierSubject: BehaviorSubject<any> = new BehaviorSubject(null);
  loader: NgxSpinnerService = inject(NgxSpinnerService);
  router: Router = inject(Router);
  http: HttpClient = inject(HttpClient);
  notificationService: NotificationService = inject(NotificationService);
  logIn(username: string, password: string) {
    this.loader.show();
    this.http
      .get(
        'https://restaurant-management-c730d-default-rtdb.firebaseio.com/Cashiers.json'
      )
      .pipe(
        map((response) => {
          let cashiers = [];
          for (const key in response) {
            if (response.hasOwnProperty(key)) {
              cashiers.push({ ...response[key], id: key });
            }
          }
          return cashiers;
        })
      )
      .subscribe({
        next: (value) => {
          let cashier = value.find((cashier: Cashier) => {
            return cashier.userName == username && cashier.password == password;
          });
          this.loader.hide();
          if (cashier) {
            this.router.navigateByUrl('cashierDashboard');
            this.notificationService.showSuccessfulSnackBar(
              username + ' عزیز با موفقیت وارد شدید.'
            );
            this.cashierSubject.next(cashier);
            this.http
              .patch(
                'https://restaurant-management-c730d-default-rtdb.firebaseio.com/Cashiers/' +
                  cashier.id +
                  '.json',
                {
                  isLoggedIn: true,
                }
              )
              .subscribe();
          } else {
            this.notificationService.showErrorSnackBar(
              'صندوقداری با این اطلاعات ثبت نشده است!'
            );
          }
        },
        error: () => {
          this.notificationService.showErrorSnackBar('خطایی رخ داد.');
          this.loader.hide();
        },
      });
  }
  logOut(id: string) {
    this.router.navigateByUrl('logIn');
    this.http
      .patch(
        'https://restaurant-management-c730d-default-rtdb.firebaseio.com/Cashiers/' +
          id +
          '.json',
        {
          isLoggedIn: false,
        }
      )
      .subscribe();
    this.cashierSubject.next(null);
  }
}
