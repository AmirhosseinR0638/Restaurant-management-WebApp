import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderFactureComponent } from './order-facture.component';

describe('OrderFactureComponent', () => {
  let component: OrderFactureComponent;
  let fixture: ComponentFixture<OrderFactureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderFactureComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrderFactureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
