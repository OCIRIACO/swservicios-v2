import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultarSalidasComponent } from './consultar-salidas.component';

describe('ConsultarSalidasComponent', () => {
  let component: ConsultarSalidasComponent;
  let fixture: ComponentFixture<ConsultarSalidasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultarSalidasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultarSalidasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
