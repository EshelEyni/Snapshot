import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileImgSettingModalComponent } from './profile-img-setting-modal.component';

describe('ProfileImgSettingModalComponent', () => {
  let component: ProfileImgSettingModalComponent;
  let fixture: ComponentFixture<ProfileImgSettingModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileImgSettingModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileImgSettingModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
