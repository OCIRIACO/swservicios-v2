import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleClienteDirectoComponent } from './detalle-cliente-directo.component';

describe('DetalleClienteDirectoComponent', () => {
  let component: DetalleClienteDirectoComponent;
  let fixture: ComponentFixture<DetalleClienteDirectoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalleClienteDirectoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleClienteDirectoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
