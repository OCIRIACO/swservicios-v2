import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultarReferenciasComponent } from './consultar-referencias.component';

describe('ConsultarReferenciasComponent', () => {
  let component: ConsultarReferenciasComponent;
  let fixture: ComponentFixture<ConsultarReferenciasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultarReferenciasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultarReferenciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
