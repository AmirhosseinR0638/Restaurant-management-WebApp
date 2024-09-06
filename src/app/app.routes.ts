import { Routes } from '@angular/router';
import { LogInComponent } from './log-in/log-in.component';
import { ManagerDashboardComponent } from './manager-dashboard/manager-dashboard.component';
import { CashierDashboardComponent } from './cashier-dashboard/cashier-dashboard.component';
import { WaiterDashboardComponent } from './waiter-dashboard/waiter-dashboard.component';
import {
  isCashierAccessed,
  isManagerAccessed,
  isWaiterAccessed,
} from './auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'logIn', pathMatch: 'full' },
  { path: 'logIn', component: LogInComponent, title: 'صفحه ورود' },
  {
    path: 'managerDashboard',
    component: ManagerDashboardComponent,
    title: 'داشبورد مدیر',
    canActivate: [isManagerAccessed],
  },
  {
    path: 'cashierDashboard',
    component: CashierDashboardComponent,
    title: 'داشبورد صندوقدار',
    canActivate: [isCashierAccessed],
  },
  {
    path: 'waiterDashboard',
    component: WaiterDashboardComponent,
    title: 'داشبورد پیشخدمت',
    canActivate: [isWaiterAccessed],
  },
];
