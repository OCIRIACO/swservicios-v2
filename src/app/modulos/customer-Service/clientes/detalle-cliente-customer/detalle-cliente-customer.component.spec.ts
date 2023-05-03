import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleClienteCustomerComponent } from './detalle-cliente-customer.component';

describe('DetalleClienteCustomerComponent', () => {
  let component: DetalleClienteCustomerComponent;
  let fixture: ComponentFixture<DetalleClienteCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalleClienteCustomerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleClienteCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
