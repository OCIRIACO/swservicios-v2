import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultarAutotransporteComponent } from './consultar-autotransporte.component';

describe('ConsultarAutotransporteComponent', () => {
  let component: ConsultarAutotransporteComponent;
  let fixture: ComponentFixture<ConsultarAutotransporteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultarAutotransporteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultarAutotransporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
