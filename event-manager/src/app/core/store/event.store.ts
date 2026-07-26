import { Injectable, computed, signal } from '@angular/core';
import { v4 as uuid } from 'uuid';

import { EventModel } from '../models/event.model';
import { STORAGE_KEYS } from '../constants/storage-key';
import { StorageService } from '../services/storage';

@Injectable({
  providedIn: 'root',
})
export class EventStore {
  private readonly eventsSignal = signal<EventModel[]>([]);

  readonly events = this.eventsSignal.asReadonly();

  readonly count = computed(() => this.events().length);

  constructor(private storage: StorageService) {
    this.load();
  }

  load() {
    const events = this.storage.get<EventModel[]>(STORAGE_KEYS.EVENTS);

    this.eventsSignal.set(events);
  }

  addEvent(name: string) {
    const events = [...this.events()];

    events.unshift({
      id: uuid(),
      name,
      createdAt: new Date().toISOString(),
    });

    this.eventsSignal.set(events);

    this.storage.set(STORAGE_KEYS.EVENTS, events);
  }

  deleteEvent(id: string) {
    const events = this.events().filter((e) => e.id !== id);

    this.eventsSignal.set(events);

    this.storage.set(STORAGE_KEYS.EVENTS, events);
  }

  getById(id: string): EventModel | undefined {
    return this.events().find((event) => event.id === id);
  }

  update(event: EventModel): void {
    const events = this.events().map((item) => (item.id === event.id ? event : item));

    this.eventsSignal.set(events);
    this.storage.set(STORAGE_KEYS.EVENTS, events);
  }
}