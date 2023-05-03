import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RootmanifiestoComponent } from './rootmanifiesto.component';

describe('RootmanifiestoComponent', () => {
  let component: RootmanifiestoComponent;
  let fixture: ComponentFixture<RootmanifiestoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RootmanifiestoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RootmanifiestoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
