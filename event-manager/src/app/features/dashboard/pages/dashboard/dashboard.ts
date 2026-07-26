import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { EventStore } from '../../../../core/store/event.store';
import { MatDialog } from '@angular/material/dialog';
import { AddEventDialog } from '../../../events/components/add-event-dialog/add-event-dialog';
import { EventFacade } from '../../../../core/facades/event.facade';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatCardModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export class Dashboard {
  private readonly eventStore = inject(EventStore);

  // events = this.eventStore.events;
  private readonly eventFacade = inject(EventFacade);

  hasEvents = computed(() => this.events().length > 0);

  private dialog = inject(MatDialog);
  
  private readonly router = inject(Router);

  readonly events = this.eventFacade.dashboardEvents;



  openDialog() {
    this.dialog
      .open(AddEventDialog)
      .afterClosed()
      .subscribe((name) => {
        if (!name) return;

        this.eventStore.addEvent(name);
      });
  }

  openEvent(id: string): void {

      this.router.navigate(['/event', id]);

  }
}