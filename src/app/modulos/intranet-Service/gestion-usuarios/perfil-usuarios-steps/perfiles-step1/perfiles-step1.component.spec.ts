import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilesStep1Component } from './perfiles-step1.component';

describe('PerfilesStep1Component', () => {
  let component: PerfilesStep1Component;
  let fixture: ComponentFixture<PerfilesStep1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PerfilesStep1Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PerfilesStep1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
