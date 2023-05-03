import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleAutotransporteComponent } from './detalle-autotransporte.component';

describe('DetalleAutotransporteComponent', () => {
  let component: DetalleAutotransporteComponent;
  let fixture: ComponentFixture<DetalleAutotransporteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalleAutotransporteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleAutotransporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
