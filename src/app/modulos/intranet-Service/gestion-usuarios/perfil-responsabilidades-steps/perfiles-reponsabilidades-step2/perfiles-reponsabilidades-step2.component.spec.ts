import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilesReponsabilidadesStep2Component } from './perfiles-reponsabilidades-step2.component';

describe('PerfilesReponsabilidadesStep2Component', () => {
  let component: PerfilesReponsabilidadesStep2Component;
  let fixture: ComponentFixture<PerfilesReponsabilidadesStep2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PerfilesReponsabilidadesStep2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PerfilesReponsabilidadesStep2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
