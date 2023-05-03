import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarAutotransporteComponent } from './editar-autotransporte.component';

describe('EditarAutotransporteComponent', () => {
  let component: EditarAutotransporteComponent;
  let fixture: ComponentFixture<EditarAutotransporteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditarAutotransporteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarAutotransporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
