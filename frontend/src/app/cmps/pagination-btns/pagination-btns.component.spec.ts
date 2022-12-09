import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginationBtnsComponent } from './pagination-btns.component';

describe('PaginationBtnsComponent', () => {
  let component: PaginationBtnsComponent;
  let fixture: ComponentFixture<PaginationBtnsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaginationBtnsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaginationBtnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
