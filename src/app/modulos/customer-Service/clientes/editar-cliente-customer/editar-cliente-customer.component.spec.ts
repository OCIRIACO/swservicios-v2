import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarClienteCustomerComponent } from './editar-cliente-customer.component';

describe('EditarClienteCustomerComponent', () => {
  let component: EditarClienteCustomerComponent;
  let fixture: ComponentFixture<EditarClienteCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditarClienteCustomerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarClienteCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
