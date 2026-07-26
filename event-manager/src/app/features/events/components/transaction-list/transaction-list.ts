import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TransactionModel } from '../../../../core/models/transaction.model';
import { CommonModule } from '@angular/common';
import { TransactionItem } from '../transaction-item/transaction-item';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-transaction-list',
  imports: [CommonModule, TransactionItem, MatCardModule, MatIconModule],
  templateUrl: './transaction-list.html',
  styleUrl: './transaction-list.scss',
})
export class TransactionList {

  @Input({required:true})
  transactions: TransactionModel[]=[];

  @Output()
  edit = new EventEmitter<TransactionModel>();

  @Output()
  delete = new EventEmitter<TransactionModel>();

}
