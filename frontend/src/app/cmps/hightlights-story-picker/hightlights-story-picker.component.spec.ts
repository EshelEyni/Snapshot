import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HightlightsStoryPickerComponent } from './hightlights-story-picker.component';

describe('HightlightsStoryPickerComponent', () => {
  let component: HightlightsStoryPickerComponent;
  let fixture: ComponentFixture<HightlightsStoryPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HightlightsStoryPickerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HightlightsStoryPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
