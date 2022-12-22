import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImgDotsComponent } from './img-dots.component';

describe('ImgDotsComponent', () => {
  let component: ImgDotsComponent;
  let fixture: ComponentFixture<ImgDotsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImgDotsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImgDotsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
