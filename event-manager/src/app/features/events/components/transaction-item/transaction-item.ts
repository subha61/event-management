import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { TransactionModel } from '../../../../core/models/transaction.model';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-transaction-item',
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './transaction-item.html',
  styleUrls: ['./transaction-item.scss'],
})
export class TransactionItem {
  @Input({ required: true })
  transaction!: TransactionModel;

  @Output()
  edit = new EventEmitter<TransactionModel>();

  @Output()
  delete = new EventEmitter<TransactionModel>();

  translateX = 0;

  private touchStartX = 0;

  private readonly MAX_TRANSLATE = 100;

  swipeDirection: 'left' | 'right' | null = null;

  readonly isTouchDevice =
  'ontouchstart' in window || navigator.maxTouchPoints > 0;


  onTouchStart(event: TouchEvent): void {

    this.touchStartX = event.touches[0].clientX;

  }

  onTouchMove(event: TouchEvent): void {

    const currentX = event.touches[0].clientX;

    let deltaX = currentX - this.touchStartX;

    // Limit swipe distance
    deltaX = Math.max(-this.MAX_TRANSLATE, Math.min(this.MAX_TRANSLATE, deltaX));

    this.translateX = deltaX;

    if (deltaX > 20) {
      this.swipeDirection = 'right';
    } else if (deltaX < -20) {
      this.swipeDirection = 'left';
    } else {
      this.swipeDirection = null;
    }

  }

  onTouchEnd(): void {

    if (this.translateX >= 70) {

      this.edit.emit(this.transaction);

    } else if (this.translateX <= -70) {

      this.delete.emit(this.transaction);

    }

    this.translateX = 0;

    this.swipeDirection = null;

  }
}