import { Routes } from '@angular/router';

export const routes: Routes = [

  {
    path: '',
    loadComponent: () =>
      import('./features/dashboard/pages/dashboard/dashboard')
        .then(c => c.Dashboard)
  },
  {
    path: 'event/:id',
    loadComponent: () =>
      import('./features/events/pages/event-details/event-details')
        .then(m => m.EventDetails)
  },

  {
    path: '**',
    redirectTo: ''
  }

];