import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoryCanvasComponent } from './story-canvas.component';

describe('StoryCanvasComponent', () => {
  let component: StoryCanvasComponent;
  let fixture: ComponentFixture<StoryCanvasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoryCanvasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoryCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
