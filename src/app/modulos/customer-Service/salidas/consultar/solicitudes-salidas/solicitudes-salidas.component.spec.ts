import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudesSalidasComponent } from './solicitudes-salidas.component';

describe('SolicitudesSalidasComponent', () => {
  let component: SolicitudesSalidasComponent;
  let fixture: ComponentFixture<SolicitudesSalidasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SolicitudesSalidasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitudesSalidasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
