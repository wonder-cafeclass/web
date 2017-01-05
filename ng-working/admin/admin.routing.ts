import { ModuleWithProviders }      from '@angular/core';
import { Routes, RouterModule }     from '@angular/router';

import { AdminComponent }           from './admin.component';
import { AdminDashboardComponent }  from './admin-dashboard.component';
import { ManageTeachersComponent }  from './manage-teachers.component';
import { ManageUsersComponent }     from './manage-users.component';
import { ManageKlassesComponent }   from './manage-klasses.component';

import { AuthGuard }                from '../auth/auth-guard.service';

const adminRoutes: Routes = [
  {
    path: '',
    component: AdminComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        canActivateChild: [AuthGuard],
        children: [
          { path: 'teachers', component: ManageTeachersComponent },
          { path: 'users', component: ManageUsersComponent },
          { path: 'klasses', component: ManageKlassesComponent },
          { path: '', component: AdminDashboardComponent }
        ]
      }
    ]
  }
];

export const adminRouting: ModuleWithProviders = RouterModule.forChild(adminRoutes);
