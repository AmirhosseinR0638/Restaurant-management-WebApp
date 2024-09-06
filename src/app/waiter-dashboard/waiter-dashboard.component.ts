import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TableService } from '../services/table.service';
import { OrderService } from '../services/order.service';
import { MessageService } from '../services/message.service';
import { Order } from '../services/models/order';
import { Table } from '../services/models/table';
import { Message } from '../services/models/message';
import { NotificationService } from '../services/notification.service';
import { WaiterService } from '../services/waiter.service';
import { Waiter } from '../services/models/waiter';
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { WaiterProfileComponent } from './waiter-profile/waiter-profile.component';

@Component({
  selector: 'app-waiter-dashbord',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    NgxSpinnerModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    WaiterProfileComponent,
  ],
  templateUrl: './waiter-dashboard.component.html',
  styleUrl: './waiter-dashboard.component.scss',
})
export class WaiterDashboardComponent implements OnInit {
  @ViewChild('msgInput') messageInput: ElementRef;
  waiterService: WaiterService = inject(WaiterService);
  orderService: OrderService = inject(OrderService);
  tableService: TableService = inject(TableService);
  messageService: MessageService = inject(MessageService);
  notificationService: NotificationService = inject(NotificationService);
  loader: NgxSpinnerService = inject(NgxSpinnerService);
  waiterInformation: Waiter;
  hideProfile: boolean = true;
  orders: Order[] = [];
  tables: Table[] = [];
  messages: Message[] = [];
  toggleProfileVisibility() {
    this.hideProfile = !this.hideProfile;
  }
  fetchOrders() {
    this.orders = [];
    this.orderService.fetchOrders().subscribe({
      next: (orders: Order[]) => {
        this.orders = orders.filter((order: Order) => {
          return order.orderType == 'رزرو میز';
        });
      },
      error: () => {
        this.notificationService.showErrorSnackBar('خطایی رخ داد!');
      },
    });
  }
  fetchTables() {
    this.loader.show('tableLoader', {
      fullScreen: true,
      type: 'ball-pulse',
    });
    this.tables = [];
    this.tableService.fetchTables().subscribe({
      next: (tables: Table[]) => {
        this.tables = tables;
      },
      error: () => {
        this.notificationService.showErrorSnackBar('خطایی رخ داد!');
      },
    });
  }
  toggleTableSituation(tableId: string, isReserved: boolean) {
    // if table reserved, will empty and if not reserved, will be reserved
    this.tableService.toggleTableSituation(tableId, isReserved).subscribe({
      next: () => {
        this.notificationService.showSuccessfulSnackBar('انجام شد.');
        this.fetchTables();
      },
      error: () => {
        this.notificationService.showErrorSnackBar('خطایی رخ داد!');
      },
    });
  }
  fetchMessages() {
    this.messages = [];
    this.messageService.fetchMessage().subscribe({
      next: (messages: Message[]) => {
        this.messages = messages;
      },
      error: () => {
        this.notificationService.showErrorSnackBar('خطایی رخ داد!');
      },
    });
  }
  sendMessage(msg: string) {
    let message = new Message('waiter', msg);
    this.messageService.sendMessage(message).subscribe({
      next: () => {
        this.notificationService.showSuccessfulSnackBar('پیام ارسال شد.');
        this.messageInput.nativeElement.value = '';
        this.fetchMessages();
      },
      error: () => {
        this.notificationService.showErrorSnackBar('خطایی رخ داد!');
      },
    });
  }
  messageChecked(msgId: string, isDone: boolean) {
    // if task of cashier message is completed
    this.messageService.messageChecked(msgId, isDone).subscribe({
      next: () => {
        this.notificationService.showSuccessfulSnackBar('انجام شد.');
        this.fetchMessages();
      },
      error: () => {
        this.notificationService.showErrorSnackBar('خطایی رخ داد!');
      },
    });
  }
  deleteMessage(msgId: string) {
    this.messageService.deleteMessage(msgId).subscribe({
      next: () => {
        this.notificationService.showSuccessfulSnackBar('پیام حذف شد.');
        this.fetchMessages();
      },
      error: () => {
        this.notificationService.showErrorSnackBar('خطایی رخ داد!');
      },
    });
  }
  logOut() {
    this.waiterService.logOut(this.waiterInformation.id);
  }
  ngOnInit() {
    this.waiterService.waiterSubject.subscribe({
      next: (waiterInfo: Waiter) => {
        this.waiterInformation = waiterInfo;
      },
    });
    this.fetchOrders();
    this.fetchTables();
    this.fetchMessages();
  }
}
