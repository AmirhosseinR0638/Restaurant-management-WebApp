import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { Table } from '../../services/models/table';
import { TableService } from '../../services/table.service';
import { NotificationService } from '../../services/notification.service';
import { MatSelectModule } from '@angular/material/select';
import { table } from 'console';
@Component({
  selector: 'app-add-table',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
  ],
  templateUrl: './add-table.component.html',
  styleUrl: './add-table.component.scss',
})
export class AddTableComponent implements OnInit {
  @Output() hideAddTableComponent: EventEmitter<boolean> = new EventEmitter();
  numberOfAllTables: number = 0;
  tableWith4Capacity: number = 0;
  tableWith8Capacity: number = 0;
  tableWith12Capacity: number = 0;
  tableWith16Capacity: number = 0;
  notificationService: NotificationService = inject(NotificationService);
  tableService: TableService = inject(TableService);
  tableForm: FormGroup = new FormGroup({
    tableNumber: new FormControl(null, Validators.required),
    tableCapacity: new FormControl(null, Validators.required),
  });
  closeAddTableComponent() {
    this.hideAddTableComponent.next(true);
  }
  formSubmitted() {
    let table = new Table(
      this.tableForm.value.tableNumber,
      +this.tableForm.value.tableCapacity
    );
    this.tableService.addTable(table).subscribe({
      next: () => {
        this.notificationService.showSuccessfulSnackBar('میز جدید اضافه شد.');
        this.closeAddTableComponent();
      },
      error: () => {
        this.notificationService.showErrorSnackBar('خطایی رخ داد!');
      },
    });
  }
  ngOnInit() {
    this.tableService.fetchTables().subscribe({
      next: (tables: Table[]) => {
        this.tableWith4Capacity = tables.filter((table) => {
          return table.capacity == 4;
        }).length;
        this.tableWith8Capacity = tables.filter((table) => {
          return table.capacity == 8;
        }).length;
        this.tableWith12Capacity = tables.filter((table) => {
          return table.capacity == 12;
        }).length;
        this.tableWith16Capacity = tables.filter((table) => {
          return table.capacity == 16;
        }).length;
        this.numberOfAllTables = tables.length;
      },
    });
  }
}
