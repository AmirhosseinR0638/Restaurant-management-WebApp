import { Component, EventEmitter, inject, Output } from '@angular/core';
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
import { MatSelectModule } from '@angular/material/select';
import { Food } from '../../services/models/food';
import { ManagerService } from '../../services/manager.service';
import { FoodService } from '../../services/food.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-add-food',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './add-food.component.html',
  styleUrl: './add-food.component.scss',
})
export class AddFoodComponent {
  @Output() hideAddFoodComponent: EventEmitter<boolean> = new EventEmitter();
  @Output() refetchFood: EventEmitter<boolean> = new EventEmitter();
  foodService: FoodService = inject(FoodService);
  notificationService: NotificationService = inject(NotificationService);
  priceWithDiscount: number = null;
  price: number = null;
  discountPercentage: number = null;
  foodForm: FormGroup = new FormGroup({
    category: new FormControl(null, Validators.required),
    foodName: new FormControl(null, Validators.required),
    price: new FormControl(null, Validators.required),
    discountPercentage: new FormControl(0, Validators.required),
    numberOfDailyServe: new FormControl(20, Validators.required),
  });
  getPrice(price: number) {
    this.price = price;
  }
  getDiscount(discount: number) {
    this.discountPercentage = discount;
  }
  calculateFinalPrice() {
    return this.price - (this.price * this.discountPercentage) / 100;
  }
  closeAddFoodComponent() {
    this.hideAddFoodComponent.next(true);
  }
  formSubmitted() {
    let formData = {
      foodName: this.foodForm.value.foodName,
      category: this.foodForm.value.category,
      price: this.foodForm.value.price,
      discountPercentage: this.foodForm.value.discountPercentage,
      numberOfDailyServe: this.foodForm.value.numberOfDailyServe,
    };
    let food = new Food(
      formData.foodName,
      formData.category,
      formData.price,
      formData.discountPercentage,
      formData.numberOfDailyServe
    );
    this.foodService.addFood(food).subscribe({
      next: () => {
        this.notificationService.showSuccessfulSnackBar(
          'آیتم غذایی جدید اضافه شد.'
        );
        this.closeAddFoodComponent();
        this.refetchFood.next(true);
      },
      error: () => {
        this.notificationService.showErrorSnackBar('خطایی رخ داد!');
      },
    });
  }
}
