import { FullscreenOverlayContainer, OverlayRef } from '@angular/cdk/overlay';
import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogConfig,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { Food } from '../../../services/models/food';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-order-facture',
  standalone: true,
  imports: [MatDialogModule, MatTableModule, CommonModule],
  providers: [
    { provide: MatDialogConfig, useValue: {} },
    { provide: OverlayRef, useClass: FullscreenOverlayContainer },
  ],
  templateUrl: './order-facture.component.html',
  styleUrl: './order-facture.component.scss',
})
export class OrderFactureComponent {
  displayedColumns: string[] = [
    'ردیف',
    'سفارش',
    'تعداد',
    'تخفیف',
    'قیمت نهایی',
  ];
  printMode: boolean = false;
  foods: Food[] = [];// ordered food
  totalPrice: number = 0;
  totalDiscount: number = 0;
  finalPrice: number = 0;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    let orderedFood = data.orderData.foods;
    for (const food of orderedFood) {
      this.foods.push(food);
    }
    this.foods.forEach((food) => {
      return (this.totalPrice += food.price);
    });
    this.foods.forEach((food) => {
      return (this.totalDiscount +=
        (food.price * food.discountPercentage) / 100);
    });
    this.finalPrice = this.totalPrice - this.totalDiscount;
  }
  printFacture() {
    this.printMode = true;
    setTimeout(() => {
      window.print();
      this.printMode = false;
    }, 300);
  }
}
