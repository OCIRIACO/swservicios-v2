import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevoClienteCustomerComponent } from './nuevo-cliente-customer.component';

describe('NuevoClienteCustomerComponent', () => {
  let component: NuevoClienteCustomerComponent;
  let fixture: ComponentFixture<NuevoClienteCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NuevoClienteCustomerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NuevoClienteCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
