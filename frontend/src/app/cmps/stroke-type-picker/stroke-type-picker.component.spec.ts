import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrokeTypePickerComponent } from './stroke-type-picker.component';

describe('StrokeTypePickerComponent', () => {
  let component: StrokeTypePickerComponent;
  let fixture: ComponentFixture<StrokeTypePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StrokeTypePickerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StrokeTypePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
