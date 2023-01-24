import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatSettingComponent } from './chat-setting.component';

describe('ChatSettingComponent', () => {
  let component: ChatSettingComponent;
  let fixture: ComponentFixture<ChatSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatSettingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
