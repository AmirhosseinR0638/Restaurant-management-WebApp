import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Chart, registerables } from 'chart.js';
import { FoodService } from '../../services/food.service';
import { Food } from '../../services/models/food';
import { NotificationService } from '../../services/notification.service';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
Chart.register(...registerables);
@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
  ],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss',
})
export class ChartComponent implements OnInit {
  @Output() hideChartComponent: EventEmitter<boolean> =
    new EventEmitter<boolean>();
  chartType: any = 'bar';
  foodService: FoodService = inject(FoodService);
  notificationService: NotificationService = inject(NotificationService);
  chart: Chart<'bar' | 'doughnut', number[], string>;
  labels: string[] = [];
  numberOfOrdered: number[] = [];
  colors: string[] = [];
  closeChartComponent() {
    this.hideChartComponent.emit(true);
  }
  changeType(type: string) { // it specify how to show chart:show as bar, show as doughnut
    this.chartType = type as keyof 'ChartTypeRegistry';
    this.chart.destroy();
    this.showChart();
  }
  showChart() {
    this.chart = new Chart('chart', {
      type: this.chartType,
      data: {
        labels: this.labels,
        datasets: [
          {
            label: 'تعداد سفارش از این غذا تا به امروز',
            data: this.numberOfOrdered,
            backgroundColor: this.colors,
            borderWidth: 1,
            hoverBorderWidth: 2,
            hoverBorderColor: '#000',
            borderRadius: 4,
            borderColor: this.colors,
          },
        ],
      },
      options: {
        indexAxis: 'x',
        plugins: {
          title: { text: 'تعداد سفارش از هر غذا تا به امروز', display: true },
        },
      },
    });
  }
  colorGenerator() { // make n color for n food for designing color of chart
    var color =
      'rgb(' +
      Math.ceil(Math.random() * 255) +
      ',' +
      Math.ceil(Math.random() * 255) +
      ',' +
      Math.ceil(Math.random() * 255) +
      ')';
    this.colors.push(color);
  }
  ngOnInit() {
    this.foodService.fetchFoodMenu().subscribe({
      next: (foods: Food[]) => {
        for (const key in foods) {
          this.labels.push(foods[key].name);
          this.numberOfOrdered.push(foods[key].numberOfOrdered);
          this.colorGenerator();
        }
        this.showChart();
      },
      error: () => {
        this.notificationService.showErrorSnackBar('خطایی رخ داد!');
      },
    });
  }
}
