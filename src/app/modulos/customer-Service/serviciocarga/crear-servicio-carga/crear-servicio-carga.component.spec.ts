import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearServicioCargaComponent } from './crear-servicio-carga.component';

describe('CrearServicioCargaComponent', () => {
  let component: CrearServicioCargaComponent;
  let fixture: ComponentFixture<CrearServicioCargaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrearServicioCargaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearServicioCargaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
