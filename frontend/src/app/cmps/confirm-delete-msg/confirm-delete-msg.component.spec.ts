import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDeleteMsgComponent } from './confirm-delete-msg.component';

describe('ConfirmDeleteMsgComponent', () => {
  let component: ConfirmDeleteMsgComponent;
  let fixture: ComponentFixture<ConfirmDeleteMsgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmDeleteMsgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmDeleteMsgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
