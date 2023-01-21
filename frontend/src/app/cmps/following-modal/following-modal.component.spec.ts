import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowingModalComponent } from './following-modal.component';

describe('FollowingModalComponent', () => {
  let component: FollowingModalComponent;
  let fixture: ComponentFixture<FollowingModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FollowingModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FollowingModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
