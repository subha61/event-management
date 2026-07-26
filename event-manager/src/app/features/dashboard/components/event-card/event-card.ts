import { Component, inject, Input } from '@angular/core';
import { EventModel } from '../../../../core/models/event.model';
import { MatCardModule } from '@angular/material/card';
import { CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-event-card',
  imports: [
    MatCardModule,
    CurrencyPipe
  ],
  templateUrl: './event-card.html',
  styleUrl: './event-card.scss',
})
export class EventCard {
  @Input({ required: true }) event!: EventModel;

  @Input() income = 0;

  @Input() expense = 0;

  @Input() transactionCount = 0;

  private readonly router = inject(Router);

  openEvent() {
    this.router.navigate(['/event', this.event.id]);
  }
}
