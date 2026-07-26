import { Injectable, inject } from '@angular/core';

import { TransactionStore } from '../store/transaction.store';
import { TransactionModel } from '../models/transaction.model';
import { DeletedTransaction } from '../models/deleted-transaction.model';

@Injectable({
  providedIn: 'root',
})
export class TransactionFacade {
  private readonly store = inject(TransactionStore);

  readonly transactions = this.store.transactions;

  add(
    eventId: string,
    name: string,
    description: string,
    type: 'income' | 'expense',
    amount: number,
  ) {
    this.store.addTransaction({
      eventId,
      name,
      description,
      type,
      amount,
    });
  }

  delete(transaction: TransactionModel): DeletedTransaction {
    const index = this.transactions().findIndex((item) => item.id === transaction.id);

    this.store.deleteTransaction(transaction.id);

    return {
      transaction,
      index,
    };
  }

  restore(deleted: DeletedTransaction): void {
    this.store.restoreTransaction(deleted.transaction, deleted.index);
  }

  getByEvent(eventId: string) {
    return this.store.getByEvent(eventId);
  }

  getIncome(eventId: string) {
    return this.store.getIncome(eventId);
  }

  getExpense(eventId: string) {
    return this.store.getExpense(eventId);
  }

  getBalance(eventId: string) {
    return this.store.getBalance(eventId);
  }

  update(transaction: TransactionModel) {
    this.store.updateTransaction(transaction);
  }
}