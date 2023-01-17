import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginationBtnPrevComponent } from './pagination-btn-prev.component';

describe('PaginationBtnPrevComponent', () => {
  let component: PaginationBtnPrevComponent;
  let fixture: ComponentFixture<PaginationBtnPrevComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaginationBtnPrevComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaginationBtnPrevComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
