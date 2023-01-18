import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscoverPeopleComponent } from './discover-people.component';

describe('DiscoverPeopleComponent', () => {
  let component: DiscoverPeopleComponent;
  let fixture: ComponentFixture<DiscoverPeopleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiscoverPeopleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiscoverPeopleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
