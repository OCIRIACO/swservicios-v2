import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RootGestionComponent } from './root-gestion.component';

describe('RootGestionComponent', () => {
  let component: RootGestionComponent;
  let fixture: ComponentFixture<RootGestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RootGestionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RootGestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
