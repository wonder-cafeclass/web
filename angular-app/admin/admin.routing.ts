import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminComponent }                from './admin.component';
import { AdminDashboardComponent }                from './admin-dashboard.component';
import { ManageUsersComponent }                from './manage-users.component';
import { ManageClassesComponent }                from './manage-classes.component';

import { AuthGuard }                from '../auth-guard.service';

const adminRoutes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        canActivateChild: [AuthGuard],
        children: [
          { path: 'classes', component: ManageClassesComponent },
          { path: 'users', component: ManageUsersComponent },
          { path: '', component: AdminDashboardComponent }
        ]
      }
    ]
  }
];

export const adminRouting: ModuleWithProviders = RouterModule.forChild(adminRoutes);
