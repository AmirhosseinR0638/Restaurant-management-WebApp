import { Component, Input } from '@angular/core';
import { Waiter } from '../../services/models/waiter';

@Component({
  selector: 'app-waiter-profile',
  standalone: true,
  imports: [],
  templateUrl: './waiter-profile.component.html',
  styleUrl: './waiter-profile.component.scss',
})
export class WaiterProfileComponent {
  @Input() waiterInformation: Waiter;
  
}
