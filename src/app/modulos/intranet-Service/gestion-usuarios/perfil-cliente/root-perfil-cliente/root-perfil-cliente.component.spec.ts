import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RootPerfilClienteComponent } from './root-perfil-cliente.component';

describe('RootPerfilClienteComponent', () => {
  let component: RootPerfilClienteComponent;
  let fixture: ComponentFixture<RootPerfilClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RootPerfilClienteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RootPerfilClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
