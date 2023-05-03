import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarClienteDirectoComponent } from './editar-cliente-directo.component';

describe('EditarClienteDirectoComponent', () => {
  let component: EditarClienteDirectoComponent;
  let fixture: ComponentFixture<EditarClienteDirectoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditarClienteDirectoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarClienteDirectoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
