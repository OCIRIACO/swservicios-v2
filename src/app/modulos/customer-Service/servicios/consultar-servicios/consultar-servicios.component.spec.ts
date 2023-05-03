import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultarServiciosComponent } from './consultar-servicios.component';

describe('ConsultarServiciosComponent', () => {
  let component: ConsultarServiciosComponent;
  let fixture: ComponentFixture<ConsultarServiciosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultarServiciosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultarServiciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
