import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AspectRatioModalComponent } from './aspect-ratio-modal.component';

describe('AspectRatioModalComponent', () => {
  let component: AspectRatioModalComponent;
  let fixture: ComponentFixture<AspectRatioModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AspectRatioModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AspectRatioModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
