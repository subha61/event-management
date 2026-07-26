import { Injectable, computed, signal } from '@angular/core';
import { v4 as uuid } from 'uuid';

import { StorageService } from '../services/storage';
import { STORAGE_KEYS } from '../constants/storage-key';
import { TransactionModel } from '../models/transaction.model';

@Injectable({
  providedIn: 'root',
})
export class TransactionStore {
  private readonly transactionsSignal = signal<TransactionModel[]>([]);

  readonly transactions = this.transactionsSignal.asReadonly();

  constructor(private storage: StorageService) {
    this.load();
  }

  load(): void {
    const data = this.storage.get<TransactionModel[]>(STORAGE_KEYS.TRANSACTIONS);

    this.transactionsSignal.set(data);
  }

  private save(transactions: TransactionModel[]): void {
    this.transactionsSignal.set(transactions);
    this.storage.set(STORAGE_KEYS.TRANSACTIONS, transactions);
  }

  addTransaction(transaction: Omit<TransactionModel, 'id' | 'createdAt'>): void {
    const transactions = [...this.transactions()];

    transactions.unshift({
      ...transaction,
      id: uuid(),
      createdAt: new Date().toISOString(),
    });

    this.save(transactions);
  }

  updateTransaction(updated: TransactionModel): void {
    const transactions = this.transactionsSignal().map((item) =>
      item.id === updated.id ? updated : item,
    );

    this.transactionsSignal.set(transactions);

    this.storage.set(STORAGE_KEYS.TRANSACTIONS, transactions);
  }

  deleteTransaction(id: string): void {
    const transactions = this.transactionsSignal().filter((item) => item.id !== id);

    this.transactionsSignal.set(transactions);

    this.storage.set(STORAGE_KEYS.TRANSACTIONS, transactions);
  }

  restoreTransaction(transaction: TransactionModel, index: number): void {
    const transactions = [...this.transactions()];

    transactions.splice(index, 0, transaction);

    this.save(transactions);
  }

  getByEvent(eventId: string): TransactionModel[] {
    return this.transactions()
      .filter((item) => item.eventId === eventId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getIncome(eventId: string): number {
    return this.getByEvent(eventId)
      .filter((item) => item.type === 'income')
      .reduce((sum, item) => sum + item.amount, 0);
  }

  getExpense(eventId: string): number {
    return this.getByEvent(eventId)
      .filter((item) => item.type === 'expense')
      .reduce((sum, item) => sum + item.amount, 0);
  }

  getBalance(eventId: string): number {
    return this.getIncome(eventId) - this.getExpense(eventId);
  }
}