import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilClienteStep1Component } from './perfil-cliente-step1.component';

describe('PerfilClienteStep1Component', () => {
  let component: PerfilClienteStep1Component;
  let fixture: ComponentFixture<PerfilClienteStep1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PerfilClienteStep1Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PerfilClienteStep1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
