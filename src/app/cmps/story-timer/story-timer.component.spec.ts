import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoryTimerComponent } from './story-timer.component';

describe('StoryTimerComponent', () => {
  let component: StoryTimerComponent;
  let fixture: ComponentFixture<StoryTimerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoryTimerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoryTimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
