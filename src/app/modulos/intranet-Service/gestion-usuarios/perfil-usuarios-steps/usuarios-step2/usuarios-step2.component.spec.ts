import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuariosStep2Component } from './usuarios-step2.component';

describe('UsuariosStep2Component', () => {
  let component: UsuariosStep2Component;
  let fixture: ComponentFixture<UsuariosStep2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsuariosStep2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsuariosStep2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
