import {
  Component,
  computed,
  inject
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
import { MatOption } from "@angular/material/core";
import { MatSelectModule } from '@angular/material/select';

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
    MatOption,
    MatSelectModule
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

  readonly transactions = computed(() => this.transactionFacade.getByEvent(this.eventId));

  editingTransaction: TransactionModel | null = null;

  private readonly snackBar = inject(MatSnackBar);

  readonly showToolbar = computed(() => this.transactions().length >= 5);

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
}