import { FullscreenOverlayContainer, OverlayRef } from '@angular/cdk/overlay';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogConfig,
  MatDialogModule,
} from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  providers: [
    { provide: MatDialogConfig, useValue: {} },
    { provide: OverlayRef, useClass: FullscreenOverlayContainer },
  ],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss',
})
export class DialogComponent {
  // for showing confirm message to delete a record of a table
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}
