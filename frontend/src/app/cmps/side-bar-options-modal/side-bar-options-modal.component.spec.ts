import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideBarOptionsModalComponent } from './side-bar-options-modal.component';

describe('SideBarOptionsModalComponent', () => {
  let component: SideBarOptionsModalComponent;
  let fixture: ComponentFixture<SideBarOptionsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SideBarOptionsModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SideBarOptionsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
