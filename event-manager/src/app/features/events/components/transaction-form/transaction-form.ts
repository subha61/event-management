import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  inject
} from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AddTransactionRequest } from '../../../../core/models/add-transaction-request.model';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ShowOnTouchedErrorStateMatcher } from '../../../../core/matchers/show-on-touched-error-state.matcher';
import { TransactionModel } from '../../../../core/models/transaction.model';

@Component({
  selector: 'app-transaction-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatButtonToggleModule,
  ],
  templateUrl: './transaction-form.html',
  styleUrls: ['./transaction-form.scss'],
})
export class TransactionForm implements OnChanges {
  private fb = inject(FormBuilder);
  matcher = new ShowOnTouchedErrorStateMatcher();

  @Output()
  add = new EventEmitter<AddTransactionRequest>();

  @Output()
  update = new EventEmitter<TransactionModel>();

  @Output()
  cancel = new EventEmitter<void>();

  readonly quickAmounts = [50, 100, 200, 500, 1000, 1500, 2000];

  @Input()
  transaction: TransactionModel | null = null;

  form = this.fb.group({
    name: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(2)]),
    description: this.fb.nonNullable.control('', [Validators.required]),
    type: this.fb.nonNullable.control<'income' | 'expense'>('income'),
    amount: this.fb.control<number | null>(null, [Validators.required, Validators.min(1)]),
  });

  selectAmount(amount: number): void {
    this.form.patchValue({
      amount,
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['transaction']) return;

    if (this.transaction) {
      this.form.patchValue({
        name: this.transaction.name,

        description: this.transaction.description,

        type: this.transaction.type,

        amount: this.transaction.amount,
      });
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.getRawValue();

    // Edit Mode
    if (this.transaction) {
      this.update.emit({
        ...this.transaction,
        name: formValue.name.trim(),
        description: formValue.description.trim(),
        type: formValue.type,
        amount: Number(formValue.amount),
      });
    }
    // Add Mode
    else {
      this.add.emit({
        name: formValue.name.trim(),
        description: formValue.description.trim(),
        type: formValue.type,
        amount: Number(formValue.amount),
      });
    }

    this.resetForm();
  }

  resetForm(emitCancel = false): void {
    this.transaction = null;

    this.form.reset({
      name: '',
      description: '',
      type: 'income',
      amount: null,
    });

    this.form.markAsPristine();
    this.form.markAsUntouched();

    if (emitCancel) {
      this.cancel.emit();
    }
  }
}