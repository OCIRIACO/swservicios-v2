import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActualizarServicioCargaComponent } from './actualizar-servicio-carga.component';

describe('ActualizarServicioCargaComponent', () => {
  let component: ActualizarServicioCargaComponent;
  let fixture: ComponentFixture<ActualizarServicioCargaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActualizarServicioCargaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActualizarServicioCargaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
