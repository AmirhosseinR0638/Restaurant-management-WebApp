import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManagerService } from '../services/manager.service';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { TableService } from '../services/table.service';
import { FoodService } from '../services/food.service';
import { ClientService } from '../services/client.service';
import { CashierService } from '../services/cashier.service';
import { WaiterService } from '../services/waiter.service';
import { Food } from '../services/models/food';
import { NotificationService } from '../services/notification.service';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';
import { OrderService } from '../services/order.service';
import { Order } from '../services/models/order';
import { Client } from '../services/models/client';
import { MatRadioModule } from '@angular/material/radio';
import { MatSortModule } from '@angular/material/sort';
import { MatSliderModule } from '@angular/material/slider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EmploymentComponent } from './employment/employment.component';
import { AddFoodComponent } from './add-food/add-food.component';
import { AddTableComponent } from './add-table/add-table.component';
import { ChartComponent } from './chart/chart.component';

@Component({
  selector: 'app-manager-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatRadioModule,
    MatSortModule,
    MatSliderModule,
    MatTooltipModule,
    EmploymentComponent,
    AddFoodComponent,
    AddTableComponent,
    ChartComponent,
  ],
  host: { ngSkipHydration: 'true' },
  templateUrl: './manager-dashboard.component.html',
  styleUrl: './manager-dashboard.component.scss',
})
export class ManagerDashboardComponent implements OnInit {
  managerService: ManagerService = inject(ManagerService);
  notificationService: NotificationService = inject(NotificationService);
  tableService: TableService = inject(TableService);
  foodService: FoodService = inject(FoodService);
  orderService: OrderService = inject(OrderService);
  clientService: ClientService = inject(ClientService);
  cashierService: CashierService = inject(CashierService);
  waiterService: WaiterService = inject(WaiterService);
  dialog: MatDialog = inject(MatDialog);
  dialogConfig = {
    width: '30%',
    enterAnimationDuration: 400,
    exitAnimationDuration: 400,
    data: {
      message: '',
    },
  };
  @ViewChild('foodName') foodName: ElementRef;
  @ViewChild('foodPrice') foodPrice: ElementRef;
  @ViewChild('foodDiscount') foodDiscount: ElementRef;
  @ViewChild('employeeFirstName') employeeFirstName: ElementRef;
  @ViewChild('employeeLastName') employeeLastName: ElementRef;
  @ViewChild('employeeUserName') employeeUserName: ElementRef;
  @ViewChild('employeePassword') employeePassword: ElementRef;
  @ViewChild('employeeSalary') employeeSalary: ElementRef;
  @ViewChild('clientFirstName') clientFirstName: ElementRef;
  @ViewChild('clientLastName') clientLastName: ElementRef;
  @ViewChild('clientAddress') clientAddress: ElementRef;
  @ViewChild('clientPhoneNumber') clientPhoneNumber: ElementRef;
  foods: Food[] = [];
  foodsCopy: Food[] = []; // for filtering or searching
  employees = [];
  employeesCopy = []; // for filtering or searching
  orders: Order[] = [];
  ordersCopy: Order[] = []; // for filtering or searching
  clients: Client[] = [];
  clientsCopy: Client[] = []; // for filtering or searching
  foodTableOnEdit: boolean = false; // when you want to edit food table
  employeeTableOnEdit: boolean = false; // when you want to edit employee table
  clientsTableOnEdit: boolean = false; // when you want to edit client table
  inputIndex: number = -1; // index of an element in tables that you want to edit it
  showEmploymentComp: boolean = false;
  showAddFoodComp: boolean = false;
  showAddTableComp: boolean = false;
  showChartComponent: boolean = false;
  foodTableHeader: { name: string; isDisabled: boolean }[] = [
    { name: 'ردیف', isDisabled: false },
    { name: 'شناسه', isDisabled: true },
    { name: 'نام', isDisabled: false },
    { name: 'قیمت', isDisabled: false },
    { name: 'تخفیف', isDisabled: false },
    { name: 'ویرایش', isDisabled: true },
    { name: 'حذف', isDisabled: true },
  ];
  employeeTableHeader: string[] = [
    'ردیف',
    'نام',
    'نام خانوادگی',
    'سمت',
    'نام کاربری',
    'رمز عبور',
    'حقوق دریافتی',
    'ویرایش',
    'حذف',
  ];
  orderTableHeader: string[] = [
    'ردیف',
    'کد سفارش',
    'نام سفارش دهنده',
    'نوع سفارش',
    'تاریخ',
    'قیمت',
  ];
  clientTableHeader: { name: string; isDisabled: boolean }[] = [
    { name: 'ردیف', isDisabled: false },
    { name: 'نام', isDisabled: false },
    { name: 'نام خانوادگی', isDisabled: false },
    { name: 'آدرس', isDisabled: true },
    { name: 'شماره تلفن', isDisabled: true },
    { name: 'میزان خرید', isDisabled: false },
    { name: 'ویرایش', isDisabled: true },
    { name: 'حذف', isDisabled: true },
  ];
  maxClientsOrderAmount: number = 0; //for mat-slider
  minClientsOrderAmount: number = 0; //for mat-slider
  clientOrderMax: number = this.minClientsOrderAmount; //for mat-slider
  clientOrderMin: number = this.maxClientsOrderAmount; //for mat-slider
  maxFoodPrice: number = 0; //for mat-slider
  minFoodPrice: number = 0; //for mat-slider
  foodPriceMax: number = this.maxFoodPrice; //for mat-slider
  foodPriceMin: number = this.minFoodPrice; //for mat-slider
  toggleVisibilityEmploymentComp(event: boolean) {
    this.showEmploymentComp = event;
  }
  toggleVisibilityAddFoodComp(event: boolean) {
    this.showAddFoodComp = event;
  }
  toggleVisibilityAddTableComp(event: boolean) {
    this.showAddTableComp = event;
  }
  toggleVisibilityChartComp(event: boolean) {
    this.showChartComponent = event;
  }
  switchOnEditMode(tableName: string, index: number) {
    // when you want to edit a record of tables, it show form controls to editing
    this.inputIndex = index;
    switch (tableName) {
      case 'foods':
        this.foodTableOnEdit = true;
        break;
      case 'employees':
        this.employeeTableOnEdit = true;
        break;
      default:
        this.clientsTableOnEdit = true;
        break;
    }
  }
  fetchFoodList() {
    this.foods = [];
    this.foodService.fetchFoodMenu().subscribe({
      next: (foods) => {
        this.foods = foods;
        this.foodsCopy = foods;
        this.foods.forEach((food) => {
          if (food.price >= this.maxFoodPrice) {
            this.maxFoodPrice = food.price;
          }
          if (food.price <= this.minFoodPrice) {
            this.minFoodPrice = food.price;
          }
        });
      },
      error: () => {
        this.notificationService.showErrorSnackBar('خطایی رخ داد!');
      },
    });
  }
  filterFoods() {
    // filter food based on mat-select value
    this.foods = this.foodsCopy.filter((food) => {
      return food.price <= this.foodPriceMin && food.price >= this.foodPriceMax;
    });
  }
  editFood(id: string) {
    this.foodTableOnEdit = false;
    this.foodService
      .editFood(
        id,
        this.foodName.nativeElement.value,
        +this.foodPrice.nativeElement.value,
        +this.foodDiscount.nativeElement.value
      )
      .subscribe({
        next: () => {
          this.notificationService.showSuccessfulSnackBar('تصحیح شد.');
          this.fetchFoodList();
        },
      });
  }
  deleteFood(id: string, name: string) {
    this.dialogConfig.data = { message: `آیا از حذف  ${name} اطمینان دارید؟` };
    let dialog = this.dialog.open(DialogComponent, this.dialogConfig);
    dialog.afterClosed().subscribe({
      next: (isDeleted: boolean) => {
        if (isDeleted) {
          this.foodService.deleteFood(id).subscribe({
            next: () => {
              this.notificationService.showSuccessfulSnackBar('حذف شد.');
              this.fetchFoodList();
            },
            error: () => {
              this.notificationService.showErrorSnackBar('خطایی رخ داد!');
            },
          });
        }
      },
    });
  }
  searchFoods(event: any) {
    let inputValue = event.target.value;
    if (inputValue != '') {
      this.foods = this.foodsCopy.filter((food) => {
        return (
          food.name.includes(inputValue) || food.foodId?.includes(inputValue)
        );
      });
    } else {
      this.foods = this.foodsCopy;
    }
  }
  sortFoods(event: any) {
    switch (event.active) {
      case 'نام':
        if (event.direction == 'asc') {
          this.foods = this.foodsCopy.sort((f1: Food, f2: Food) => {
            if (f1.name > f2.name) {
              return 1;
            } else if (f1.name < f2.name) {
              return -1;
            }
            return 0;
          });
        } else {
          this.foods = this.foodsCopy.sort((f1: Food, f2: Food) => {
            if (f2.name > f1.name) {
              return 1;
            } else if (f2.name < f1.name) {
              return -1;
            }
            return 0;
          });
        }
        break;
      case 'قیمت':
        if (event.direction == 'asc') {
          this.foods = this.foodsCopy.sort((f1: Food, f2: Food) => {
            return f1.price - f2.price;
          });
        } else {
          this.foods = this.foodsCopy.sort((f1: Food, f2: Food) => {
            return f2.price - f1.price;
          });
        }
        break;
      case 'تخفیف':
        if (event.direction == 'asc') {
          this.foods = this.foodsCopy.sort((f1: Food, f2: Food) => {
            return f1.discountPercentage - f2.discountPercentage;
          });
        } else {
          this.foods = this.foodsCopy.sort((f1: Food, f2: Food) => {
            return f2.discountPercentage - f1.discountPercentage;
          });
        }
        break;
      default:
        this.foods = this.foodsCopy.reverse();
    }
  }
  fetchEmployees() {
    this.employees = [];
    let results = [];
    this.managerService.fetchCashiers().subscribe({
      next: (cashiers) => {
        for (const key in cashiers) {
          results.push({ ...cashiers[key], post: 'صندوقدار' });
        }
        this.managerService.fetchWaiters().subscribe({
          next: (waiters) => {
            for (const key in waiters) {
              results.push({ ...waiters[key], post: 'پیشخدمت' });
            }
            this.employees = results;
            this.employeesCopy = results;
          },
          error: () => {
            this.notificationService.showErrorSnackBar('خطایی رخ داد!');
          },
        });
      },
      error: () => {
        this.notificationService.showErrorSnackBar('خطایی رخ داد!');
      },
    });
  }
  filterEmployees(event: any) {
    switch (event.value) {
      case 'opt1':
        this.employees = this.employeesCopy.filter((employee) => {
          return employee.post == 'صندوقدار';
        });
        break;
      case 'opt2':
        this.employees = this.employeesCopy.filter((employee) => {
          return employee.post == 'پیشخدمت';
        });
        break;
      default:
        this.employees = this.employeesCopy;
        break;
    }
  }
  editEmployee(post: string, id: string) {
    this.employeeTableOnEdit = false;
    if (post == 'صندوقدار') {
      this.managerService
        .editCashierAccount(
          id,
          this.employeeFirstName.nativeElement.value,
          this.employeeLastName.nativeElement.value,
          this.employeeUserName.nativeElement.value,
          this.employeePassword.nativeElement.value,
          +this.employeeSalary.nativeElement.value
        )
        .subscribe({
          next: () => {
            this.notificationService.showSuccessfulSnackBar('تصحیح شد.');
            this.fetchEmployees();
          },
          error: () => {
            this.notificationService.showErrorSnackBar('خطایی رخ داد!');
          },
        });
    } else {
      this.managerService
        .editWaiterAccount(
          id,
          this.employeeFirstName.nativeElement.value,
          this.employeeLastName.nativeElement.value,
          this.employeeUserName.nativeElement.value,
          this.employeePassword.nativeElement.value,
          +this.employeeSalary.nativeElement.value
        )
        .subscribe({
          next: () => {
            this.notificationService.showSuccessfulSnackBar('تصحیح شد.');
            this.fetchEmployees();
          },
          error: () => {
            this.notificationService.showErrorSnackBar('خطایی رخ داد!');
          },
        });
    }
  }
  deleteEmployee(post: string, id: string, name: string) {
    this.dialogConfig.data = { message: `آیا از حذف  ${name} اطمینان دارید؟` };
    let dialog = this.dialog.open(DialogComponent, this.dialogConfig);
    dialog.afterClosed().subscribe({
      next: (isDeleted: boolean) => {
        if (isDeleted) {
          if (post == 'صندوقدار') {
            this.managerService.deleteCashierAccount(id).subscribe({
              next: () => {
                this.notificationService.showSuccessfulSnackBar('حذف شد.');
                this.fetchEmployees();
              },
              error: () => {
                this.notificationService.showErrorSnackBar('خطایی رخ داد!');
              },
            });
          } else {
            this.managerService.deleteWaiterAccount(id).subscribe({
              next: () => {
                this.notificationService.showSuccessfulSnackBar('حذف شد.');
                this.fetchEmployees();
              },
              error: () => {
                this.notificationService.showErrorSnackBar('خطایی رخ داد!');
              },
            });
          }
        }
      },
    });
  }
  fetchOrders() {
    this.orders = [];
    this.orderService.fetchOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.ordersCopy = orders;
      },
      error: () => {
        this.notificationService.showErrorSnackBar('خطایی رخ داد!');
      },
    });
  }
  searchOrders(event: any) {
    let inputValue = event.target.value;
    this.orders = this.ordersCopy.filter((order) => {
      return (
        order.orderId.includes(inputValue) ||
        order.clientName.includes(inputValue) ||
        order.date.includes(inputValue)
      );
    });
  }
  fetchClients() {
    this.clients = [];
    this.clientService.fetchClientsAccounts().subscribe({
      next: (clients) => {
        this.clients = clients;
        this.clientsCopy = clients;
        this.clients.forEach((client) => {
          if (client.amountOfOrders >= this.maxClientsOrderAmount) {
            this.maxClientsOrderAmount = client.amountOfOrders + 10000;
          }
          if (client.amountOfOrders <= this.minClientsOrderAmount) {
            this.minClientsOrderAmount = client.amountOfOrders;
          }
        });
      },
      error: () => {
        this.notificationService.showErrorSnackBar('خطایی رخ داد!');
      },
    });
  }
  searchClients(event: any) {
    let inputValue = event.target.value;
    if (inputValue != '') {
      this.clients = this.clientsCopy.filter((client) => {
        return (
          client.firstName.includes(inputValue) ||
          client.lastName.includes(inputValue)
        );
      });
    } else {
      this.clients = this.clientsCopy;
    }
  }
  sortClients(event: any) {
    switch (event.active) {
      case 'نام':
        if (event.direction == 'asc') {
          this.clients = this.clientsCopy.sort((c1: Client, c2: Client) => {
            if (c1.firstName > c2.firstName) {
              return 1;
            } else if (c1.firstName < c2.firstName) {
              return -1;
            }
            return 0;
          });
        } else {
          this.clients = this.clientsCopy.sort((c1: Client, c2: Client) => {
            if (c2.firstName > c1.firstName) {
              return 1;
            } else if (c2.firstName < c1.firstName) {
              return -1;
            }
            return 0;
          });
        }
        break;
      case 'نام خانوادگی':
        if (event.direction == 'asc') {
          this.clients = this.clientsCopy.sort((c1: Client, c2: Client) => {
            if (c1.lastName > c2.lastName) {
              return 1;
            } else if (c1.lastName < c2.lastName) {
              return -1;
            }
            return 0;
          });
        } else {
          this.clients = this.clientsCopy.sort((c1: Client, c2: Client) => {
            if (c2.lastName > c1.lastName) {
              return 1;
            } else if (c2.lastName < c1.lastName) {
              return -1;
            }
            return 0;
          });
        }
        break;
      case 'میزان خرید':
        if (event.direction == 'asc') {
          this.clients = this.clientsCopy.sort((c1: Client, c2: Client) => {
            return c1.amountOfOrders - c2.amountOfOrders;
          });
        } else {
          this.clients = this.clientsCopy.sort((c1: Client, c2: Client) => {
            return c2.amountOfOrders - c1.amountOfOrders;
          });
        }
        break;
      default:
        this.clients = this.clientsCopy.reverse();
        break;
    }
  }
  filterClients() {
    // filter clients based on mat-select value
    this.clients = this.clientsCopy.filter((client) => {
      return (
        client.amountOfOrders <= this.clientOrderMin &&
        client.amountOfOrders >= this.clientOrderMax
      );
    });
  }
  editClient(id: string) {
    this.clientsTableOnEdit = false;
    this.clientService
      .editClientAccount(
        id,
        this.clientFirstName.nativeElement.value,
        this.clientLastName.nativeElement.value,
        this.clientAddress.nativeElement.value,
        this.clientPhoneNumber.nativeElement.value
      )
      .subscribe({
        next: () => {
          this.notificationService.showSuccessfulSnackBar('تصحیح شد.');
          this.fetchClients();
        },
        error: () => {
          this.notificationService.showErrorSnackBar('خطایی رخ داد!');
        },
      });
  }
  deleteClient(id: string, firstName: string, lastName: string) {
    this.dialogConfig.data = {
      message: `آیا از حذف  ${firstName + ' ' + lastName} اطمینان دارید؟`,
    };
    let dialog = this.dialog.open(DialogComponent, this.dialogConfig);
    dialog.afterClosed().subscribe({
      next: (isDeleted: boolean) => {
        if (isDeleted) {
          this.clientService.deleteClientAccount(id).subscribe({
            next: () => {
              this.notificationService.showSuccessfulSnackBar('حذف شد.');
              this.fetchClients();
            },
            error: () => {
              this.notificationService.showErrorSnackBar('خطایی رخ داد!');
            },
          });
        }
      },
    });
  }
  logOut() {
    this.managerService.logOut();
  }
  refetchData() {
    // when refresh button clicked,again it refetch all data
    this.fetchFoodList();
    this.fetchEmployees();
    this.fetchOrders();
    this.fetchClients();
  }
  ngOnInit() {
    this.fetchFoodList();
    this.fetchEmployees();
    this.fetchOrders();
    this.fetchClients();
  }
}
