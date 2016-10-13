import { ModuleWithProviders }   from '@angular/core';
import { Routes, RouterModule }  from '@angular/router';

import { CClassCenterHomeComponent } from './cclass-center-home.component';
import { CClassListComponent }       from './cclass-list.component';
import { CClassCenterComponent }     from './cclass-center.component';
import { CClassDetailComponent }     from './cclass-detail.component';

import { CanDeactivateGuard }    from '../guard/can-deactivate-guard.service';

import { CClassDetailResolve }   from './cclass-detail-resolve.service';

const cclassCenterRoutes: Routes = [
  {
    path: '',
    redirectTo: '/cclass-center',
    pathMatch: 'full'
  },
  {
    path: 'cclass-center',
    component: CClassCenterComponent,
    children: [
      {
        path: '',
        component: CClassListComponent,
        children: [
          {
            path: ':id',
            component: CClassDetailComponent,
            canDeactivate: [CanDeactivateGuard],
            resolve: {
              cclass: CClassDetailResolve
            }
          },
          {
            path: '',
            component: CClassCenterHomeComponent
          }
        ]
      }
    ]
  }
];

export const cclassCenterRouting: ModuleWithProviders = RouterModule.forChild(cclassCenterRoutes);


/*
Copyright 2016 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/