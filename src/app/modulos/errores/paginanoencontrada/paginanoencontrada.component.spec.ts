import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginanoencontradaComponent } from './paginanoencontrada.component';

describe('PaginanoencontradaComponent', () => {
  let component: PaginanoencontradaComponent;
  let fixture: ComponentFixture<PaginanoencontradaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaginanoencontradaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaginanoencontradaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
