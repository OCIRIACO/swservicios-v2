import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearAutotransporteComponent } from './crear-autotransporte.component';

describe('CrearAutotransporteComponent', () => {
  let component: CrearAutotransporteComponent;
  let fixture: ComponentFixture<CrearAutotransporteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrearAutotransporteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearAutotransporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
