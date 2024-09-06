import { Component, inject, OnDestroy, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Client } from '../../services/models/client';
import { CashierService } from '../../services/cashier.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { EventEmitter } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { NotificationService } from '../../services/notification.service';
import { ClientService } from '../../services/client.service';
@Component({
  selector: 'app-create-client',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    NgxSpinnerModule,
  ],
  templateUrl: './create-client.component.html',
  styleUrl: './create-client.component.scss',
})
export class CreateClientComponent implements OnDestroy {
  @Output() clientFormVisibility = new EventEmitter<boolean>();
  loader: NgxSpinnerService = inject(NgxSpinnerService);
  notificationService: NotificationService = inject(NotificationService);
  cashierService: CashierService = inject(CashierService);
  clientService: ClientService = inject(ClientService);
  formSubmitted: boolean = false;
  clientForm: FormGroup = new FormGroup({
    firstName: new FormControl(null, Validators.required),
    lastName: new FormControl(null, Validators.required),
    address: new FormControl(null),
    phoneNumber: new FormControl(null, Validators.required),
  });
  createClientAccount() {
    this.formSubmitted = true;
    this.loader.show();
    let client = new Client(
      this.clientForm.value.firstName,
      this.clientForm.value.lastName,
      this.clientForm.value.address,
      this.clientForm.value.phoneNumber
    );
    this.clientService.createClientAccount(client).subscribe({
      error: () => {
        this.notificationService.showErrorSnackBar('خطایی رخ داد.');
        this.closeForm();
      },
      complete: () => {
        this.notificationService.showSuccessfulSnackBar(
          'اشتراک با موفقیت اضافه شد.'
        );
        this.closeForm();
      },
    });
  }
  closeForm() {
    this.clientFormVisibility.emit(false);
  }
  ngOnDestroy() {
    this.loader.hide();
  }
}
