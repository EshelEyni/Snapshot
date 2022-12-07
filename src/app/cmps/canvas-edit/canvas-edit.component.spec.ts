import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanvasEditComponent } from './canvas-edit.component';

describe('CanvasEditComponent', () => {
  let component: CanvasEditComponent;
  let fixture: ComponentFixture<CanvasEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CanvasEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CanvasEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
