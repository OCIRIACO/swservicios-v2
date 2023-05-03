import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RootPerfilResponsabilidadesComponent } from './root-perfil-responsabilidades.component';

describe('RootPerfilResponsabilidadesComponent', () => {
  let component: RootPerfilResponsabilidadesComponent;
  let fixture: ComponentFixture<RootPerfilResponsabilidadesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RootPerfilResponsabilidadesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RootPerfilResponsabilidadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
