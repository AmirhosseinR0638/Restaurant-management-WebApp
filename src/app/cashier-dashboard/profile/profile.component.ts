import { Component, Input } from '@angular/core';
import { Cashier } from '../../services/models/cashier';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  @Input() cashierInformation: Cashier;
}
