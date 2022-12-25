import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostFilterPickerComponent } from './post-filter-picker.component';

describe('PostFilterPickerComponent', () => {
  let component: PostFilterPickerComponent;
  let fixture: ComponentFixture<PostFilterPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostFilterPickerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostFilterPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
