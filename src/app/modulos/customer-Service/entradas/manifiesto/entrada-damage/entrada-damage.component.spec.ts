import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntradaDamageComponent } from './entrada-damage.component';

describe('EntradaDamageComponent', () => {
  let component: EntradaDamageComponent;
  let fixture: ComponentFixture<EntradaDamageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntradaDamageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntradaDamageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
