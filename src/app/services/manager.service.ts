import { inject, Injectable } from '@angular/core';
import { Cashier } from './models/cashier';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from './notification.service';
import { Waiter } from './models/waiter';
import { BehaviorSubject, map } from 'rxjs';
import { Router } from '@angular/router';
import { Manager } from './models/manager';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root',
})
export class ManagerService {
  http: HttpClient = inject(HttpClient);
  loader: NgxSpinnerService = inject(NgxSpinnerService);
  router: Router = inject(Router);
  notificationService: NotificationService = inject(NotificationService);
  managerSubject: BehaviorSubject<Manager> = new BehaviorSubject<Manager>(null);
  isLoggedIn: boolean = false;
  logIn(userName: string, password: string) {
    this.loader.show();
    this.http
      .get(
        'https://restaurant-management-c730d-default-rtdb.firebaseio.com/Managers.json'
      )
      .pipe(
        map((response) => {
          let managers = [];
          for (const key in response) {
            if (response.hasOwnProperty(key)) {
              managers.push({ ...response[key], id: key });
            }
          }
          return managers;
        })
      )
      .subscribe({
        next: (managers: Manager[]) => {
          let manager = managers.find((manager) => {
            return manager.userName == userName && manager.password == password;
          });
          if (manager) {
            this.managerSubject.next(manager);
            this.notificationService.showSuccessfulSnackBar(
              'مدیر گرامی باموفقیت وارد شدید.'
            );
            this.isLoggedIn = true;
            this.router.navigateByUrl('managerDashboard');
          } else {
            this.notificationService.showErrorSnackBar(
              'نام کاربری یا رمز عبور صحیح نمی باشد!'
            );
          }
          this.loader.hide();
        },
        error: () => {
          this.notificationService.showErrorSnackBar('خطایی رخ داد!');
          this.loader.hide();
        },
      });
  }
  logOut() {
    this.router.navigateByUrl('logIn');
    this.isLoggedIn = false;
    this.managerSubject.next(null);
  }
  fetchCashiers() {
    return this.http
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
      );
  }
  createCashierAccount(cashier: Cashier) {
    return this.http.post(
      'https://restaurant-management-c730d-default-rtdb.firebaseio.com/Cashiers.json',
      cashier
    );
  }
  editCashierAccount(
    id: string,
    firstName: string,
    lastName: string,
    userName: string,
    password: string,
    salary: number
  ) {
    return this.http.patch(
      'https://restaurant-management-c730d-default-rtdb.firebaseio.com/Cashiers/' +
        id +
        '.json',
      {
        firstName: firstName,
        lastName: lastName,
        userName: userName,
        password: password,
        salary: salary,
      }
    );
  }
  deleteCashierAccount(id: string) {
    return this.http.delete(
      'https://restaurant-management-c730d-default-rtdb.firebaseio.com/Cashiers/' +
        id +
        '.json'
    );
  }
  fetchWaiters() {
    return this.http
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
      );
  }
  createWaiterAccount(waiter: Waiter) {
    return this.http.post(
      'https://restaurant-management-c730d-default-rtdb.firebaseio.com/Waiters.json',
      waiter
    );
  }
  editWaiterAccount(
    id: string,
    firstName: string,
    lastName: string,
    userName: string,
    password: string,
    salary: number
  ) {
    return this.http.patch(
      'https://restaurant-management-c730d-default-rtdb.firebaseio.com/Waiters/' +
        id +
        '.json',
      {
        firstName: firstName,
        lastName: lastName,
        userName: userName,
        password: password,
        salary: salary,
      }
    );
  }
  deleteWaiterAccount(id: string) {
    return this.http.delete(
      'https://restaurant-management-c730d-default-rtdb.firebaseio.com/Waiters/' +
        id +
        '.json'
    );
  }
}
