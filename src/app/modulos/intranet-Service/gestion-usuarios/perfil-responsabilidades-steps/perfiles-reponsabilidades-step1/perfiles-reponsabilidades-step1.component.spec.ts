import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilesReponsabilidadesStep1Component } from './perfiles-reponsabilidades-step1.component';

describe('PerfilesReponsabilidadesStep1Component', () => {
  let component: PerfilesReponsabilidadesStep1Component;
  let fixture: ComponentFixture<PerfilesReponsabilidadesStep1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PerfilesReponsabilidadesStep1Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PerfilesReponsabilidadesStep1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
