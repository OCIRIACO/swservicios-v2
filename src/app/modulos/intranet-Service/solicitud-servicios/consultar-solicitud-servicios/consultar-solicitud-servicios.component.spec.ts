import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultarSolicitudServiciosComponent } from './consultar-solicitud-servicios.component';

describe('ConsultarSolicitudServiciosComponent', () => {
  let component: ConsultarSolicitudServiciosComponent;
  let fixture: ComponentFixture<ConsultarSolicitudServiciosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultarSolicitudServiciosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultarSolicitudServiciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
