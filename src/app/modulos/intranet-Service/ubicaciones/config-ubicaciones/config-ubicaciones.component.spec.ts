import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigUbicacionesComponent } from './config-ubicaciones.component';

describe('ConfigUbicacionesComponent', () => {
  let component: ConfigUbicacionesComponent;
  let fixture: ComponentFixture<ConfigUbicacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigUbicacionesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigUbicacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
