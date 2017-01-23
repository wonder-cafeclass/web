import { ModuleWithProviders }      from '@angular/core';
import { Routes, RouterModule }     from '@angular/router';

import { KlassListComponent }       from './klass-list.component';
import { KlassCenterComponent }     from './klass-center.component';

const klassCenterRoutes: Routes = [
  {
    path: '',
    redirectTo: '/class-center',
    pathMatch: 'full'
  },
  {
    path: 'class-center',
    component: KlassCenterComponent,
    children: [
      {
        path: '',
        component: KlassListComponent
      }
    ]
  }
];

export const klassCenterRouting: ModuleWithProviders = RouterModule.forChild(klassCenterRoutes);