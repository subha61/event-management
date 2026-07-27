import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  MAT_BOTTOM_SHEET_DATA,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';

import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

export type TransactionFilter = 'all' | 'income' | 'expense';

@Component({
  selector: 'app-filter-bottom-sheet',
  imports: [
    CommonModule,
    MatListModule,
    MatIconModule,
  ],
  templateUrl: './filter-bottom-sheet.html',
  styleUrls: ['./filter-bottom-sheet.scss'],
})
export class FilterBottomSheet {

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA)
    public selected: TransactionFilter,

    private bottomSheetRef: MatBottomSheetRef<FilterBottomSheet>,
  ) {}

  select(filter: TransactionFilter) {

    this.bottomSheetRef.dismiss(filter);

  }

}