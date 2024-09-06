import { Component, EventEmitter, inject, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { Cashier } from '../../services/models/cashier';
import { ManagerService } from '../../services/manager.service';
import { NotificationService } from '../../services/notification.service';
import { Waiter } from '../../services/models/waiter';

@Component({
  selector: 'app-employment',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatRadioModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './employment.component.html',
  styleUrl: './employment.component.scss',
})
export class EmploymentComponent {
  managerService: ManagerService = inject(ManagerService);
  notificationService: NotificationService = inject(NotificationService);
  @Output() hideEmploymentComponent = new EventEmitter<boolean>();
  @Output() refetchEmployees = new EventEmitter<boolean>();
  formMode: string = 'صندوقدار';
  employmentForm: FormGroup = new FormGroup({
    firstName: new FormControl(null, Validators.required),
    lastName: new FormControl(null, Validators.required),
    age: new FormControl(null, Validators.required),
    gender: new FormControl(null, Validators.required),
    username: new FormControl(null, Validators.required),
    password: new FormControl(null, Validators.required),
    salary: new FormControl(null, Validators.required),
  });
  closeEmploymentComponent() {
    this.hideEmploymentComponent.emit(true);
  }
  changeFormMode(event: any) {
    this.formMode = event.value;
  }
  formSubmitted() {
    let formData = {
      firstName: this.employmentForm.value.firstName,
      lastName: this.employmentForm.value.lastName,
      age: this.employmentForm.value.age,
      gender: this.employmentForm.value.gender,
      username: this.employmentForm.value.username,
      password: this.employmentForm.value.password,
      salary: this.employmentForm.value.salary,
    };
    if (this.formMode == 'صندوقدار') {
      //adding cashier account
      let cashier = new Cashier(
        formData.firstName,
        formData.lastName,
        formData.gender,
        formData.age,
        formData.username,
        formData.password,
        formData.salary
      );
      this.managerService.createCashierAccount(cashier).subscribe({
        next: () => {
          this.notificationService.showSuccessfulSnackBar(
            'صندوقدار جدید اضافه شد.'
          );
          this.closeEmploymentComponent();
          this.refetchEmployees.emit(true); //refetch employees from database
        },
        error: () => {
          this.notificationService.showErrorSnackBar('خطایی رخ داد!');
        },
      });
    } else {
      // adding waiter account
      let waiter = new Waiter(
        formData.firstName,
        formData.lastName,
        formData.gender,
        formData.age,
        formData.username,
        formData.password,
        formData.salary
      );
      this.managerService.createWaiterAccount(waiter).subscribe({
        next: () => {
          this.notificationService.showSuccessfulSnackBar(
            'پیشخدمت جدید اضافه شد.'
          );
          this.closeEmploymentComponent();
          this.refetchEmployees.emit(true); //refetch employees from database
        },
        error: () => {
          this.notificationService.showErrorSnackBar('خطایی رخ داد!');
        },
      });
    }
  }
}
