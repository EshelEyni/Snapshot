import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoryOptionsModalComponent } from './story-options-modal.component';

describe('StoryOptionsModalComponent', () => {
  let component: StoryOptionsModalComponent;
  let fixture: ComponentFixture<StoryOptionsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoryOptionsModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoryOptionsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
