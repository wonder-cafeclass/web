import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserListComponent }    from './user-list.component';
import { UserDetailComponent }  from './user-detail.component';

const usersRoutes: Routes = [
  { path: 'users',  component: UserListComponent },
  { path: 'user/:id', component: UserDetailComponent }
];

export const usersRouting: ModuleWithProviders = RouterModule.forChild(usersRoutes);
