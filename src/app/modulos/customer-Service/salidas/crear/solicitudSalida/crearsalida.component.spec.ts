import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearsalidaComponent } from './crearsalida.component';

describe('CrearsalidaComponent', () => {
  let component: CrearsalidaComponent;
  let fixture: ComponentFixture<CrearsalidaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrearsalidaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearsalidaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
