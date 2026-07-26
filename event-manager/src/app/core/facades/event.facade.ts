import {
  Injectable,
  computed,
  inject
} from '@angular/core';

import { EventStore } from '../store/event.store';
import { TransactionStore } from '../store/transaction.store';

import { DashboardEvent } from '../models/dashboard-event.model';

@Injectable({
  providedIn: 'root'
})
export class EventFacade {

  private readonly eventStore = inject(EventStore);

  private readonly transactionStore = inject(TransactionStore);

  readonly events = this.eventStore.events;

  readonly dashboardEvents = computed<DashboardEvent[]>(() => {

    const events = this.eventStore.events();

    const transactions = this.transactionStore.transactions();

    return events.map(event => {

      const eventTransactions = transactions.filter(
        transaction => transaction.eventId === event.id
      );

      const income = eventTransactions
        .filter(transaction => transaction.type === 'income')
        .reduce((sum, transaction) => sum + transaction.amount, 0);

      const expense = eventTransactions
        .filter(transaction => transaction.type === 'expense')
        .reduce((sum, transaction) => sum + transaction.amount, 0);

      return {
        id: event.id,
        name: event.name,
        createdAt: event.createdAt,

        transactionCount: eventTransactions.length,

        income,
        expense,

        balance: income - expense
      };

    });

  });

  add(name: string): void {
    this.eventStore.addEvent(name);
  }

  delete(id: string): void {
    this.eventStore.deleteEvent(id);
  }

  getById(id: string) {
    return this.eventStore.getById(id);
  }

  update(event: any): void {
    this.eventStore.update(event);
  }

}