import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HighlightsNameEditComponent } from './highlights-name-edit.component';

describe('HighlightsNameEditComponent', () => {
  let component: HighlightsNameEditComponent;
  let fixture: ComponentFixture<HighlightsNameEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HighlightsNameEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HighlightsNameEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
