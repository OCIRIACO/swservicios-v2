import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RootOperacionesComponent } from './root-operaciones.component';

describe('RootOperacionesComponent', () => {
  let component: RootOperacionesComponent;
  let fixture: ComponentFixture<RootOperacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RootOperacionesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RootOperacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
