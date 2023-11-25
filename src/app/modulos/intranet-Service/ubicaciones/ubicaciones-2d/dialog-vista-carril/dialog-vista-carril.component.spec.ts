import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogVistaCarrilComponent } from './dialog-vista-carril.component';

describe('DialogVistaCarrilComponent', () => {
  let component: DialogVistaCarrilComponent;
  let fixture: ComponentFixture<DialogVistaCarrilComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogVistaCarrilComponent]
    });
    fixture = TestBed.createComponent(DialogVistaCarrilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
