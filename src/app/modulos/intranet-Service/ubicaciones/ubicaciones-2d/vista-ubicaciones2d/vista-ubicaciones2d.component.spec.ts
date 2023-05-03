import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaUbicaciones2dComponent } from './vista-ubicaciones2d.component';

describe('VistaUbicaciones2dComponent', () => {
  let component: VistaUbicaciones2dComponent;
  let fixture: ComponentFixture<VistaUbicaciones2dComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VistaUbicaciones2dComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VistaUbicaciones2dComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
