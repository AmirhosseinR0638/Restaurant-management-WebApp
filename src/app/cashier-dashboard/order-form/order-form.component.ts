import {
  Component,
  EventEmitter,
  inject,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FoodService } from '../../services/food.service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { Food } from '../../services/models/food';
import { Client } from '../../services/models/client';
import { AsyncPipe } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { CashierService } from '../../services/cashier.service';
import { NotificationService } from '../../services/notification.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { OrderFactureComponent } from './order-facture/order-facture.component';
import { Order } from '../../services/models/order';
import { TableService } from '../../services/table.service';
import { Table } from '../../services/models/table';
import { ClientService } from '../../services/client.service';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-order-form',
  standalone: true,
  imports: [
    AsyncPipe,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatIconModule,
    NgxSpinnerModule,
    MatDialogModule,
    OrderFactureComponent,
  ],
  templateUrl: './order-form.component.html',
  styleUrl: './order-form.component.scss',
})
export class OrderFormComponent implements OnInit, OnDestroy {
  @Output() orderFormVisibility = new EventEmitter<boolean>();
  @Output() showCreateClientForm = new EventEmitter<boolean>();
  formSubmitted: boolean = false; //not allowed change form controls when order submitted
  isPrintMode: boolean = false; //hide some element when print screen
  loader: NgxSpinnerService = inject(NgxSpinnerService);
  notificationService: NotificationService = inject(NotificationService);
  tableService: TableService = inject(TableService);
  foodService: FoodService = inject(FoodService);
  cashierService: CashierService = inject(CashierService);
  clientService: ClientService = inject(ClientService);
  orderService: OrderService = inject(OrderService);
  tables: Observable<Table[]> = new Observable();
  foods: Observable<Food[]> = new Observable();
  clients: Observable<Client[]> = new Observable();
  ordered: Food[] = [];
  totalPrice: number = 0;
  priceWithDiscount: number = 0;
  selectedOption: string = 'رزرو میز';
  clientInformation: Client = null;
  facture: MatDialog = inject(MatDialog); //order facture
  orderForm: FormGroup = new FormGroup({
    clientName: new FormControl(null, Validators.required),
    orderType: new FormControl('رزرو میز', Validators.required),
    reservedTable: new FormControl(null),
    firstName: new FormControl(null),
    lastName: new FormControl(null),
    address: new FormControl(null),
    phoneNumber: new FormControl(null),
    foodMenu: new FormControl(null, Validators.required),
    paid: new FormControl(null),
  });
  createClientAccount() {
    // show form of adding client account
    this.closeForm();
    this.showCreateClientForm.emit(true);
  }
  fetchClientInformation(name: string) {
    //search in data base to find client by name
    this.clientService.fetchClientsAccounts().subscribe({
      next: (clients) => {
        this.clientInformation = clients.find((client) => {
          return client.firstName + ' ' + client.lastName == name;
        });
        this.setClientInformation();
      },
      error: () => {
        this.notificationService.showErrorSnackBar('خطایی رخ داد!');
      },
    });
  }
  setClientInformation() {
    //when client account selected, it put his/her information in form
    this.orderForm.patchValue({
      firstName: this.clientInformation.firstName,
      lastName: this.clientInformation.lastName,
      address: this.clientInformation.address,
      phoneNumber: this.clientInformation.phoneNumber,
    });
  }
  addToOrders(orderedFoods: Food[]) {
    // if food selected from a select box, this function add it to ordered array and calculate total price of ordered
    this.ordered = [...orderedFoods];
    this.ordersPriceCalculator();
  }
  deleteOrder(index: number) {
    this.ordered.splice(index, 1);
    this.ordersPriceCalculator();
  }
  ordersPriceCalculator() {
    // calculate total price of ordered
    this.totalPrice = 0;
    this.priceWithDiscount = 0;
    this.ordered.forEach((order) => {
      this.priceWithDiscount +=
        order.price - order.price * (order.discountPercentage / 100);
      this.totalPrice += order.price;
    });
  }
  reserveTableAfterOrderSubmitted(tableNumber: number) {
    this.tables.subscribe({
      next: (tables: Table[]) => {
        let table = tables.find((table) => {
          return table.number == tableNumber;
        });
        this.tableService
          .toggleTableSituation(table.id, table.isReserved)
          .subscribe();
      },
    });
  }
  orderSubmitted() {
    this.formSubmitted = true;
    this.orderForm.disable();
    this.loader.show();
    this.foodService.decreaseRemindNumber(this.ordered); // it decrease number of remind food when ordered
    this.foodService.increaseNumberOfOrderedFood(this.ordered); // it increase number of ordered food (it's like score for food)
    let orderData = {
      clientFirstName: this.orderForm.value.firstName,
      clientLastName: this.orderForm.value.lastName,
      clientPhoneNumber: this.orderForm.value.phoneNumber,
      clientAddress: this.orderForm.value.address,
      orderType: this.orderForm.value.orderType,
      table: this.orderForm.value.reservedTable,
      date: this.dateCalculator(),
      foods: this.ordered,
      totalPrice: this.totalPrice,
      priceWithDiscount: this.priceWithDiscount,
      isPaid: this.orderForm.value.paid,
    }; //send data for showing facture information
    if (orderData.orderType == 'رزرو میز') {
      this.reserveTableAfterOrderSubmitted(orderData.table);
    }
    this.clientService.increaseAmountOfClientOrder(
      orderData.clientFirstName,
      orderData.clientLastName,
      orderData.priceWithDiscount
    ); // add price of order to client account to increase client's amount of order(it's like score for clients)
    let order = new Order(
      orderData.clientFirstName + ' ' + orderData.clientLastName,
      orderData.clientPhoneNumber,
      orderData.clientAddress,
      orderData.orderType,
      orderData.date,
      this.ordered,
      this.totalPrice,
      orderData.isPaid
    ); //for send order data to database
    this.orderService.orderFood(order).subscribe({
      next: () => {
        this.closeForm();
        this.facture.open(OrderFactureComponent, {
          width: '700px',
          height: 'auto',
          data: {
            orderData: orderData,
            orderId: order.orderId,
          },
          enterAnimationDuration: '600ms',
          exitAnimationDuration: '600ms',
          backdropClass: 'backdrop',
          panelClass: 'facture',
        });
        this.notificationService.showSuccessfulSnackBar('سفارش ثبت شد.');
      },
      error: () => {
        this.notificationService.showErrorSnackBar('خطایی رخ داد!');
        this.orderForm.enable();
        this.formSubmitted = false;
        this.loader.hide();
      },
    });
  }
  toggleSelectedOption(typeOfOrder: any) {
    this.selectedOption = typeOfOrder.value;
  }
  closeForm() {
    this.orderFormVisibility.emit(false);
  }
  dateCalculator() {
    //change date format for showing in facture
    const date = new Date();
    const result =
      date.getFullYear() +
      '/' +
      (date.getMonth() + 1) +
      '/' +
      date.getDate() +
      '_' +
      date.getHours() +
      ':' +
      date.getMinutes() +
      ':' +
      date.getSeconds();
    return result;
  }
  ngOnInit() {
    this.foods = this.foodService.fetchFoodMenu();
    this.clients = this.clientService.fetchClientsAccounts();
    this.tables = this.tableService.fetchTables();
  }
  ngOnDestroy() {
    this.loader.hide();
  }
}
