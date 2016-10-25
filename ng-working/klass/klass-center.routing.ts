import { ModuleWithProviders }      from '@angular/core';
import { Routes, RouterModule }     from '@angular/router';

import { KlassCenterHomeComponent } from './klass-center-home.component';
import { KlassListComponent }       from './klass-list.component';
import { KlassCenterComponent }     from './klass-center.component';
import { KlassDetailComponent }     from './klass-detail.component';

import { CanDeactivateGuard }       from '../guard/can-deactivate-guard.service';

import { KlassDetailResolve }       from './klass-detail-resolve.service';

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
      },
      {
        path: ':id',
        component: KlassDetailComponent,
        canDeactivate: [CanDeactivateGuard],
        resolve: {
          klass: KlassDetailResolve
        }
      }
    ]
  }
];

export const klassCenterRouting: ModuleWithProviders = RouterModule.forChild(klassCenterRoutes);