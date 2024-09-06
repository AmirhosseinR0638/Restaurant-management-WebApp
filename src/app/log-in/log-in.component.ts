import { Component, inject, OnDestroy } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CashierService } from '../services/cashier.service';
import { NgxSpinner, NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { WaiterService } from '../services/waiter.service';
import { ManagerService } from '../services/manager.service';
@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonToggleModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatProgressSpinnerModule,
    NgxSpinnerModule,
  ],
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.scss',
})
export class LogInComponent {
  formMode: string = 'پیشخدمت';
  cashierService: CashierService = inject(CashierService);
  waiterService: WaiterService = inject(WaiterService);
  managerService: ManagerService = inject(ManagerService);
  loginForm: FormGroup = new FormGroup({
    username: new FormControl(null, Validators.required),
    password: new FormControl(null, [
      Validators.required,
      Validators.minLength(6),
    ]),
  });
  changeFormMode(mode: any) {
    // mode: cahier-waiter-manager
    this.formMode = mode.value;
    this.loginForm.reset();
  }
  onSubmit() {
    let formData = {
      username: this.loginForm.value.username,
      password: this.loginForm.value.password,
    };
    switch (this.formMode) {
      case 'صندوقدار':
        this.cashierService.logIn(formData.username, formData.password);
        break;
      case 'مدیر':
        this.managerService.logIn(formData.username, formData.password);
        break;
      default:
        this.waiterService.logIn(formData.username, formData.password);
        break;
    }
  }
}
