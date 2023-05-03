import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultarServicioCargaComponent } from './consultar-servicio-carga.component';

describe('ConsultarServicioCargaComponent', () => {
  let component: ConsultarServicioCargaComponent;
  let fixture: ComponentFixture<ConsultarServicioCargaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultarServicioCargaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultarServicioCargaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
