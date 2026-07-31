import {
  Component,
  computed,
  HostListener,
  inject,
  signal,
  ViewChild
} from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { EventFacade } from '../../../../core/facades/event.facade';
import { TransactionFacade } from '../../../../core/facades/transaction.facade';
import { TransactionForm } from '../../components/transaction-form/transaction-form';
import { AddTransactionRequest } from '../../../../core/models/add-transaction-request.model';
import { SummaryCard } from '../../../../shared/components/summary-card/summary-card';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TransactionList } from '../../components/transaction-list/transaction-list';
import { TransactionModel } from '../../../../core/models/transaction.model';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { FilterBottomSheet } from '../../../../shared/components/filter-bottom-sheet/filter-bottom-sheet';
import { MatDividerModule } from '@angular/material/divider';
type TransactionTypeFilter = 'all' | 'income' | 'expense';

type TransactionDateFilter = 'all' | 'today' | 'yesterday';

@Component({
  selector: 'app-event-details',
  imports: [
    TransactionForm,
    SummaryCard,
    CommonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    TransactionList,
    MatSnackBarModule,
    MatSelectModule,
    MatMenuModule,
    MatDividerModule
  ],
  templateUrl: './event-details.html',
  styleUrls: ['./event-details.scss'],
})
export class EventDetails {
  private readonly route = inject(ActivatedRoute);

  private readonly router = inject(Router);

  private readonly eventFacade = inject(EventFacade);

  private readonly transactionFacade = inject(TransactionFacade);

  readonly eventId = this.route.snapshot.paramMap.get('id')!;

  readonly event = this.eventFacade.getById(this.eventId);

  readonly income = computed(() => this.transactionFacade.getIncome(this.eventId));

  readonly expense = computed(() => this.transactionFacade.getExpense(this.eventId));

  readonly balance = computed(() => this.transactionFacade.getBalance(this.eventId));

  readonly allTransactions = computed(() => this.transactionFacade.getByEvent(this.eventId));

  readonly transactions = computed(() => {
    let transactions = [...this.allTransactions()];

    // Filter
    if (this.typeFilter() !== 'all') {
      transactions = transactions.filter((item) => item.type === this.typeFilter());
    }

    // Date filter
    switch (this.dateFilter()) {
      case 'today':
        transactions = transactions.filter((item) => this.isToday(item.createdAt));
        break;

      case 'yesterday':
        transactions = transactions.filter((item) => this.isYesterday(item.createdAt));
        break;
    }

    // Search
    const keyword = this.search().trim().toLowerCase();

    if (keyword) {
      transactions = transactions.filter((item) => {
        return (
          item.name.toLowerCase().includes(keyword) ||
          item.description.toLowerCase().includes(keyword) ||
          item.amount.toString().includes(keyword)
        );
      });
    }

    return transactions;
  });

  editingTransaction: TransactionModel | null = null;

  private readonly snackBar = inject(MatSnackBar);

  readonly showToolbar = computed(() => this.allTransactions().length > 0);

  readonly toolbarElevated = signal(false);

  readonly typeFilter = signal<TransactionTypeFilter>('all');

  readonly dateFilter = signal<TransactionDateFilter>('all');

  private readonly bottomSheet = inject(MatBottomSheet);

  readonly search = signal('');

  readonly isMobile = signal(false);

  @HostListener('window:resize')
  onResize() {
    this.isMobile.set(window.innerWidth <= 768);
  }

  ngOnInit() {
    this.onResize();
  }

  @HostListener('window:scroll')
  onScroll() {
    this.toolbarElevated.set(window.scrollY > 40);
  }

  back() {
    this.router.navigateByUrl('/');
  }

  addTransaction(data: AddTransactionRequest) {
    this.transactionFacade.add(this.eventId, data.name, data.description, data.type, data.amount);
  }

  editTransaction(transaction: TransactionModel) {
    this.editingTransaction = transaction;
  }

  updateTransaction(transaction: TransactionModel) {
    this.transactionFacade.update(transaction);

    this.editingTransaction = null;
  }

  cancelEdit() {
    this.editingTransaction = null;
  }

  deleteTransaction(transaction: TransactionModel): void {
    const deleted = this.transactionFacade.delete(transaction);

    const snackBarRef = this.snackBar.open('Transaction deleted', 'UNDO', {
      duration: 5000,
    });

    snackBarRef.onAction().subscribe(() => {
      this.transactionFacade.restore(deleted);
    });
  }

  changeTypeFilter(filter: TransactionTypeFilter) {
    this.typeFilter.set(filter);
  }

  changeDateFilter(filter: TransactionDateFilter) {
    this.dateFilter.set(filter);
  }

  openFilter(): void {
    if (this.isMobile()) {
      const ref = this.bottomSheet.open(FilterBottomSheet, {
        data: {
          type: this.typeFilter(),
          date: this.dateFilter(),
        },
      });

      ref.afterDismissed().subscribe((filter) => {
        if (filter) {
          this.changeTypeFilter(filter.type);
          this.changeDateFilter(filter.date);
        }
      });
    }
  }

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;

    this.search.set(value);
  }

  clearSearch(): void {
    this.search.set('');
  }

  private isToday(date: string): boolean {
    const today = new Date();

    const value = new Date(date);

    return (
      value.getDate() === today.getDate() &&
      value.getMonth() === today.getMonth() &&
      value.getFullYear() === today.getFullYear()
    );
  }

  private isYesterday(date: string): boolean {
    const yesterday = new Date();

    yesterday.setDate(yesterday.getDate() - 1);

    const value = new Date(date);

    return (
      value.getDate() === yesterday.getDate() &&
      value.getMonth() === yesterday.getMonth() &&
      value.getFullYear() === yesterday.getFullYear()
    );
  }
}