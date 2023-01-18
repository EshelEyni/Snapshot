import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HighlightsModalComponent } from './highlights-modal.component';

describe('HighlightsModalComponent', () => {
  let component: HighlightsModalComponent;
  let fixture: ComponentFixture<HighlightsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HighlightsModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HighlightsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
