import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileOptionsModalComponent } from './profile-options-modal.component';

describe('ProfileOptionsModalComponent', () => {
  let component: ProfileOptionsModalComponent;
  let fixture: ComponentFixture<ProfileOptionsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileOptionsModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileOptionsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
