import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostEditModalComponent } from './post-edit-modal.component';

describe('PostEditModalComponent', () => {
  let component: PostEditModalComponent;
  let fixture: ComponentFixture<PostEditModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostEditModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
