import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilClienteStep2Component } from './perfil-cliente-step2.component';

describe('PerfilClienteStep2Component', () => {
  let component: PerfilClienteStep2Component;
  let fixture: ComponentFixture<PerfilClienteStep2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PerfilClienteStep2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PerfilClienteStep2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
