import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallesSalidaComponent } from './detalles-salida.component';

describe('DetallesSalidaComponent', () => {
  let component: DetallesSalidaComponent;
  let fixture: ComponentFixture<DetallesSalidaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetallesSalidaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetallesSalidaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
