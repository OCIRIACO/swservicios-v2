import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RootSolicitudServiciosComponent } from './root-solicitud-servicios.component';

describe('RootSolicitudServiciosComponent', () => {
  let component: RootSolicitudServiciosComponent;
  let fixture: ComponentFixture<RootSolicitudServiciosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RootSolicitudServiciosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RootSolicitudServiciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
