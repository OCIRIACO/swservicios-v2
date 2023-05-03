import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultamanifiestoComponent } from './consultamanifiesto.component';

describe('ConsultamanifiestoComponent', () => {
  let component: ConsultamanifiestoComponent;
  let fixture: ComponentFixture<ConsultamanifiestoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultamanifiestoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultamanifiestoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
