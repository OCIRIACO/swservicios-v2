import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificamanifiestoComponent } from './notificamanifiesto.component';

describe('NotificamanifiestoComponent', () => {
  let component: NotificamanifiestoComponent;
  let fixture: ComponentFixture<NotificamanifiestoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotificamanifiestoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificamanifiestoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
