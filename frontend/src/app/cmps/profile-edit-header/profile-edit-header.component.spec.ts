import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileEditHeaderComponent } from './profile-edit-header.component';

describe('ProfileEditHeaderComponent', () => {
  let component: ProfileEditHeaderComponent;
  let fixture: ComponentFixture<ProfileEditHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileEditHeaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileEditHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
