import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserMyComponent }  from './user-my.component';

const usersRoutes: Routes = [
  // { path: 'user/my', component: UserMyComponent }
  { path: 'my', component: UserMyComponent }
];

export const usersRouting: ModuleWithProviders = RouterModule.forChild(usersRoutes);
