import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(
    private successfulSnackBar: MatSnackBar,
    private errorSnackBar: MatSnackBar
  ) {}
  showSuccessfulSnackBar(message: string) {
    this.successfulSnackBar.open(message, '', {
      duration: 4000,
      direction: 'rtl',
      verticalPosition: 'top',
      horizontalPosition: 'right',
      panelClass: 'successful',
    });
  }
  showErrorSnackBar(message: string) {
    this.errorSnackBar.open(message, '', {
      duration: 4000,
      direction: 'rtl',
      verticalPosition: 'top',
      horizontalPosition: 'right',
      panelClass: 'error',
    });
  }
}
