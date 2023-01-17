import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileDetailsHeaderComponent } from './profile-details-header.component';

describe('ProfileDetailsHeaderComponent', () => {
  let component: ProfileDetailsHeaderComponent;
  let fixture: ComponentFixture<ProfileDetailsHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileDetailsHeaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileDetailsHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
