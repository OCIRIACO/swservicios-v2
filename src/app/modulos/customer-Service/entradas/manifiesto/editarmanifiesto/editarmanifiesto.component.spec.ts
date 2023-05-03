import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarmanifiestoComponent } from './editarmanifiesto.component';

describe('EditarmanifiestoComponent', () => {
  let component: EditarmanifiestoComponent;
  let fixture: ComponentFixture<EditarmanifiestoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditarmanifiestoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarmanifiestoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
