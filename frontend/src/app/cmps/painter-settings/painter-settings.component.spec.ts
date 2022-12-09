import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PainterSettingsComponent } from './painter-settings.component';

describe('PainterSettingsComponent', () => {
  let component: PainterSettingsComponent;
  let fixture: ComponentFixture<PainterSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PainterSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PainterSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
