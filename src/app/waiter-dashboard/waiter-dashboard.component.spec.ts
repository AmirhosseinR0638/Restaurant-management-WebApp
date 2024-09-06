import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaiterDashbordComponent } from './waiter-dashboard.component';

describe('WaiterDashbordComponent', () => {
  let component: WaiterDashbordComponent;
  let fixture: ComponentFixture<WaiterDashbordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WaiterDashbordComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WaiterDashbordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
