import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActualizarSolicitudSalidaComponent } from './actualizar-solicitud-salida.component';

describe('ActualizarSolicitudSalidaComponent', () => {
  let component: ActualizarSolicitudSalidaComponent;
  let fixture: ComponentFixture<ActualizarSolicitudSalidaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActualizarSolicitudSalidaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActualizarSolicitudSalidaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
