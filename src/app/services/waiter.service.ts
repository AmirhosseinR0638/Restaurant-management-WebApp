import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from './notification.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { BehaviorSubject, map } from 'rxjs';
import { Waiter } from './models/waiter';

@Injectable({
  providedIn: 'root',
})
export class WaiterService {
  waiterSubject: BehaviorSubject<Waiter> = new BehaviorSubject(null);
  loader: NgxSpinnerService = inject(NgxSpinnerService);
  router: Router = inject(Router);
  http: HttpClient = inject(HttpClient);
  notificationService: NotificationService = inject(NotificationService);
  logIn(username: string, password: string) {
    this.loader.show();
    this.http
      .get(
        'https://restaurant-management-c730d-default-rtdb.firebaseio.com/Waiters.json'
      )
      .pipe(
        map((response) => {
          let waiters = [];
          for (const key in response) {
            if (response.hasOwnProperty(key)) {
              waiters.push({ ...response[key], id: key });
            }
          }
          return waiters;
        })
      )
      .subscribe({
        next: (value) => {
          let waiter = value.find((waiter: Waiter) => {
            return waiter.userName == username && waiter.password == password;
          });
          this.loader.hide();
          if (waiter) {
            this.router.navigateByUrl('waiterDashboard');
            this.notificationService.showSuccessfulSnackBar(
              username + ' عزیز با موفقیت وارد شدید.'
            );
            this.http
              .patch(
                'https://restaurant-management-c730d-default-rtdb.firebaseio.com/Waiters/' +
                  waiter.id +
                  '.json',
                {
                  isLoggedIn: true,
                }
              )
              .subscribe();
            this.waiterSubject.next(waiter);
          } else {
            this.notificationService.showErrorSnackBar(
              'پیشخدمتی با این اطلاعات ثبت نشده است!'
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
        'https://restaurant-management-c730d-default-rtdb.firebaseio.com/Waiters/' +
          id +
          '.json',
        {
          isLoggedIn: false,
        }
      )
      .subscribe();
    this.waiterSubject.next(null);
  }
}
