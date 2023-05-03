import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RootPerfilUsuariosStepsComponent } from './root-perfil-usuarios-steps.component';

describe('RootPerfilUsuariosStepsComponent', () => {
  let component: RootPerfilUsuariosStepsComponent;
  let fixture: ComponentFixture<RootPerfilUsuariosStepsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RootPerfilUsuariosStepsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RootPerfilUsuariosStepsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
