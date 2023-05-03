import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearReferenciaComponent } from './crear-referencia.component';

describe('CrearReferenciaComponent', () => {
  let component: CrearReferenciaComponent;
  let fixture: ComponentFixture<CrearReferenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrearReferenciaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearReferenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
