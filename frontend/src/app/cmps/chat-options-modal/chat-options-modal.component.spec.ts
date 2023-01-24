import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatOptionsModalComponent } from './chat-options-modal.component';

describe('ChatOptionsModalComponent', () => {
  let component: ChatOptionsModalComponent;
  let fixture: ComponentFixture<ChatOptionsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatOptionsModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatOptionsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
