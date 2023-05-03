import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RootUbicacionesComponent } from './root-ubicaciones.component';

describe('RootUbicacionesComponent', () => {
  let component: RootUbicacionesComponent;
  let fixture: ComponentFixture<RootUbicacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RootUbicacionesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RootUbicacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
