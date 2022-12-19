import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostOptionsModalComponent } from './post-options-modal.component';

describe('PostOptionsModalComponent', () => {
  let component: PostOptionsModalComponent;
  let fixture: ComponentFixture<PostOptionsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostOptionsModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostOptionsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
