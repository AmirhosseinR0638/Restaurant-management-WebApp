import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Table } from './models/table';
import { NotificationService } from './notification.service';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TableService {
  http: HttpClient = inject(HttpClient);
  notificationService: NotificationService = inject(NotificationService);
  numberOfTables: number;
  addTable(table: Table) {
    return this.http.post(
      'https://restaurant-management-c730d-default-rtdb.firebaseio.com/Tables.json',
      table
    );
  }
  fetchTables() {
    return this.http
      .get(
        'https://restaurant-management-c730d-default-rtdb.firebaseio.com/Tables.json'
      )
      .pipe(
        map((response) => {
          let tables = [];
          for (const key in response) {
            if (response.hasOwnProperty(key)) {
              tables.push({ ...response[key], id: key });
            }
          }
          this.numberOfTables = tables.length;
          return tables;
        })
      );
  }
  toggleTableSituation(tableId: string, isReserved: boolean) {
    // if table reserved, will empty and if not reserved, will be reserved
    return this.http.patch(
      'https://restaurant-management-c730d-default-rtdb.firebaseio.com/Tables/' +
        tableId +
        '.json',
      { isReserved: !isReserved }
    );
  }
}
