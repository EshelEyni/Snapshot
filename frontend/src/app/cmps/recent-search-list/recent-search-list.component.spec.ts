import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentSearchListComponent } from './recent-search-list.component';

describe('RecentSearchListComponent', () => {
  let component: RecentSearchListComponent;
  let fixture: ComponentFixture<RecentSearchListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecentSearchListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecentSearchListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
