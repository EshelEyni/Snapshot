import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginationBtnNextComponent } from './pagination-btn-next.component';

describe('PaginationBtnNextComponent', () => {
  let component: PaginationBtnNextComponent;
  let fixture: ComponentFixture<PaginationBtnNextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaginationBtnNextComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaginationBtnNextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
