import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostEditFormComponent } from './post-edit-form.component';

describe('PostEditFormComponent', () => {
  let component: PostEditFormComponent;
  let fixture: ComponentFixture<PostEditFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostEditFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostEditFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
