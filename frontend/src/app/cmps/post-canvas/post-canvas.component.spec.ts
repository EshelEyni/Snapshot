import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostCanvasComponent } from './post-canvas.component';

describe('PostCanvasComponent', () => {
  let component: PostCanvasComponent;
  let fixture: ComponentFixture<PostCanvasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostCanvasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
