import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LikeModalComponent } from './like-modal.component';

describe('LikeModalComponent', () => {
  let component: LikeModalComponent;
  let fixture: ComponentFixture<LikeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LikeModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LikeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
