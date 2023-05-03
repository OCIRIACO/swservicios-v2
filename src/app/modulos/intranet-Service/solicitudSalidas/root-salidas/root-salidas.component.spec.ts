import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RootSalidasComponent } from './root-salidas.component';

describe('RootSalidasComponent', () => {
  let component: RootSalidasComponent;
  let fixture: ComponentFixture<RootSalidasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RootSalidasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RootSalidasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
