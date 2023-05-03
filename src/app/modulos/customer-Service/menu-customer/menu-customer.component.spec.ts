import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuCustomerComponent } from './menu-customer.component';

describe('MenuCustomerComponent', () => {
  let component: MenuCustomerComponent;
  let fixture: ComponentFixture<MenuCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuCustomerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
