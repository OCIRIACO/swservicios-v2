import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleServicioCargaComponent } from './detalle-servicio-carga.component';

describe('DetalleServicioCargaComponent', () => {
  let component: DetalleServicioCargaComponent;
  let fixture: ComponentFixture<DetalleServicioCargaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalleServicioCargaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleServicioCargaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
