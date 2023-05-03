import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultarClienteCustomerComponent } from './consultar-cliente-customer.component';

describe('ConsultarClienteCustomerComponent', () => {
  let component: ConsultarClienteCustomerComponent;
  let fixture: ComponentFixture<ConsultarClienteCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultarClienteCustomerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultarClienteCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
