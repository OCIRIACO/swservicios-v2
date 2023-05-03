import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleSolicitudServiciosComponent } from './detalle-solicitud-servicios.component';

describe('DetalleSolicitudServiciosComponent', () => {
  let component: DetalleSolicitudServiciosComponent;
  let fixture: ComponentFixture<DetalleSolicitudServiciosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalleSolicitudServiciosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleSolicitudServiciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
