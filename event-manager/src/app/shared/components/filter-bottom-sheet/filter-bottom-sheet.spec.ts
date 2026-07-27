import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterBottomSheet } from './filter-bottom-sheet';

describe('FilterBottomSheet', () => {
  let component: FilterBottomSheet;
  let fixture: ComponentFixture<FilterBottomSheet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterBottomSheet],
    }).compileComponents();

    fixture = TestBed.createComponent(FilterBottomSheet);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
