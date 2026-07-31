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
  imports: [CommonModule, MatListModule, MatIconModule],
  templateUrl: './filter-bottom-sheet.html',
  styleUrls: ['./filter-bottom-sheet.scss'],
})
export class FilterBottomSheet {
  selectedType: 'all' | 'income' | 'expense';

  selectedDate: 'all' | 'today' | 'yesterday';

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA)
    public data: any,

    private readonly sheetRef: MatBottomSheetRef<FilterBottomSheet>,
  ) {
    this.selectedType = data.type;

    this.selectedDate = data.date;
  }

  apply(): void {
    this.sheetRef.dismiss({
      type: this.selectedType,

      date: this.selectedDate,
    });
  }
  close(): void {
    this.sheetRef.dismiss();
  }
}