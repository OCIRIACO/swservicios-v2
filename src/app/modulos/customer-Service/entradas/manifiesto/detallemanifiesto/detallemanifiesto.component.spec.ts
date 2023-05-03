import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallemanifiestoComponent } from './detallemanifiesto.component';

describe('DetallemanifiestoComponent', () => {
  let component: DetallemanifiestoComponent;
  let fixture: ComponentFixture<DetallemanifiestoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetallemanifiestoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetallemanifiestoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
