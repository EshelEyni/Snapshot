import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StickerPickerComponent } from './sticker-picker.component';

describe('StickerPickerComponent', () => {
  let component: StickerPickerComponent;
  let fixture: ComponentFixture<StickerPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StickerPickerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StickerPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
