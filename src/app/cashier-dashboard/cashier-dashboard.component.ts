import { Component, inject, OnInit } from '@angular/core';
import { CashierService } from '../services/cashier.service';
import { MatButtonModule } from '@angular/material/button';
import { Cashier } from '../services/models/cashier';
import { ProfileComponent } from './profile/profile.component';
import { FoodService } from '../services/food.service';
import { CreateClientComponent } from './create-client/create-client.component';
import { OrderFormComponent } from './order-form/order-form.component';
import { Order } from '../services/models/order';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../services/notification.service';
import { TableService } from '../services/table.service';
import { Table } from '../services/models/table';
import { MessengerComponent } from './messenger/messenger.component';
import { OrderService } from '../services/order.service';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-cashier-dashboard',
  standalone: true,
  imports: [
    MatButtonModule,
    ProfileComponent,
    CreateClientComponent,
    OrderFormComponent,
    CommonModule,
    MessengerComponent,
    MatIconModule,
    RouterModule,
  ],
  templateUrl: './cashier-dashboard.component.html',
  styleUrl: './cashier-dashboard.component.scss',
})
export class CashierDashboardComponent implements OnInit {
  notificationService: NotificationService = inject(NotificationService);
  cashierService: CashierService = inject(CashierService);
  orderService: OrderService = inject(OrderService);
  foodService: FoodService = inject(FoodService);
  tableService: TableService = inject(TableService);
  showClientForm: boolean = false;
  showProfile: boolean = false;
  showOrderForm: boolean = false;
  showOrderLoader: boolean = false;
  showTableLoader: boolean = false;
  showMessenger: boolean = false;
  cashierInformation: Cashier = null;
  orders: Order[] = [];
  tables: Table[] = [];
  notReservedTables: number = 0;
  toggleClientFormVisibility(event: boolean) {
    this.showClientForm = event;
  }
  toggleOrderFormVisibility(event: boolean) {
    this.showOrderForm = event;
    if (!event) {
      //when order form component closed, refetch because may be add new order to database
      this.fetchOrders();
      this.fetchTables();
    }
  }
  toggleMessengerVisibility(event: boolean) {
    this.showMessenger = event;
  }
  showCreateClientForm() {
    this.showClientForm = true;
  }
  fetchOrders() {
    this.orders = [];
    this.showOrderLoader = true;
    this.orderService.fetchOrders().subscribe({
      next: (orders: Order[]) => {
        this.orders = orders.reverse(); //show newest orders
        this.showOrderLoader = false;
      },
      error: () => {
        this.notificationService.showErrorSnackBar('خطایی رخ داد!');
        this.showOrderLoader = false;
      },
    });
  }
  deleteOrder(orderId: string) {
    this.orderService.deleteOrder(orderId).subscribe({
      next: () => {
        this.notificationService.showSuccessfulSnackBar('سفارش حذف شد.');
        this.fetchOrders();
      },
      error: () => {
        this.notificationService.showErrorSnackBar('خطایی رخ داد!');
      },
    });
  }
  fetchTables() {
    this.tables = [];
    this.showTableLoader = true;
    this.tableService.fetchTables().subscribe({
      next: (tables: Table[]) => {
        this.showTableLoader = false;
        this.tables = tables;
        this.notReservedTables = this.tables.filter((table) => {
          return table.isReserved == false;
        }).length; //number of empty tables for reserving
      },
      error: () => {
        this.showTableLoader = false;
        this.notificationService.showErrorSnackBar('خطایی رخ داد!');
      },
    });
  }
  toggleTableSituation(table: Table) {
    // if table reserved, will empty and if not reserved, will be reserved
    this.tableService
      .toggleTableSituation(table.id, table.isReserved)
      .subscribe({
        next: () => {
          this.notificationService.showSuccessfulSnackBar('انجام شد.');
          this.fetchTables();
        },
        error: () => {
          this.notificationService.showErrorSnackBar('خطایی رخ داد!');
        },
      });
  }
  logOut() {
    this.cashierService.logOut(this.cashierInformation.id);
  }
  ngOnInit() {
    this.cashierService.cashierSubject.subscribe({
      //get cashier info to showing his/her profile
      next: (value) => {
        this.cashierInformation = value;
      },
      error: () => {
        this.notificationService.showErrorSnackBar('خطایی رخ داد!');
      },
    });
    this.fetchOrders();
    this.fetchTables();
  }
}
