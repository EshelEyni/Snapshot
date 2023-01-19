import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HightlightsCoverPickerComponent } from './hightlights-cover-picker.component';

describe('HightlightsCoverPickerComponent', () => {
  let component: HightlightsCoverPickerComponent;
  let fixture: ComponentFixture<HightlightsCoverPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HightlightsCoverPickerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HightlightsCoverPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
