import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificarSalidasComponent } from './verificar-salidas.component';

describe('VerificarSalidasComponent', () => {
  let component: VerificarSalidasComponent;
  let fixture: ComponentFixture<VerificarSalidasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerificarSalidasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerificarSalidasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
