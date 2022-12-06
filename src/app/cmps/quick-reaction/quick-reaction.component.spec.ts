import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickReactionComponent } from './quick-reaction.component';

describe('QuickReactionComponent', () => {
  let component: QuickReactionComponent;
  let fixture: ComponentFixture<QuickReactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuickReactionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuickReactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
