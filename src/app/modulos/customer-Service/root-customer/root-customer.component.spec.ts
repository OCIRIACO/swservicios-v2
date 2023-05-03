import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RootCustomerComponent } from './root-customer.component';

describe('RootCustomerComponent', () => {
  let component: RootCustomerComponent;
  let fixture: ComponentFixture<RootCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RootCustomerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RootCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
