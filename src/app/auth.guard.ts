import { inject } from '@angular/core';
import { ManagerService } from './services/manager.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotificationService } from './services/notification.service';
import { CashierService } from './services/cashier.service';
import { WaiterService } from './services/waiter.service';

export const isManagerAccessed = () => {
  const managerService: ManagerService = inject(ManagerService);
  const router: Router = inject(Router);
  const loader = inject(NgxSpinnerService);
  const notificationService = inject(NotificationService);
  managerService.managerSubject.subscribe({
    next: (manager) => {
      if (manager) {
        return true;
      }
      router.navigateByUrl('logIn');
      loader.hide();
      notificationService.showErrorSnackBar('لطفا ابتدا وارد حساب خود شوید!');
      return false;
    },
  });
  if (managerService.managerSubject) {
    return true;
  }
  router.navigateByUrl('logIn');
  loader.hide();
  notificationService.showErrorSnackBar('لطفا ابتدا وارد حساب خود شوید!');
  return false;
};
export const isCashierAccessed = () => {
  const cashierService = inject(CashierService);
  const router: Router = inject(Router);
  const loader = inject(NgxSpinnerService);
  const notificationService = inject(NotificationService);
  cashierService.cashierSubject.subscribe({
    next: (cahier) => {
      if (cahier) {
        return true;
      }
      router.navigateByUrl('logIn');
      loader.hide();
      notificationService.showErrorSnackBar('لطفا ابتدا وارد حساب خود شوید!');
      return false;
    },
  });
};
export const isWaiterAccessed = () => {
  const waiterService = inject(WaiterService);
  const router: Router = inject(Router);
  const loader = inject(NgxSpinnerService);
  const notificationService = inject(NotificationService);
  waiterService.waiterSubject.subscribe({
    next: (waiter) => {
      if (waiter) {
        return true;
      }
      router.navigateByUrl('logIn');
      loader.hide();
      notificationService.showErrorSnackBar('لطفا ابتدا وارد حساب خود شوید!');
      return false;
    },
  });
};
