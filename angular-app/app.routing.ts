import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { loginRoutes, authProviders }  from './login.routing';

import { CanDeactivateGuard } from './can-deactivate-guard.service';
import { AuthGuard }          from './auth-guard.service';

const adminRoutes: Routes = [
  {
    path: 'admin',
    loadChildren: 'app/admin/admin.module#AdminModule'
  }
];
const appRoutes: Routes = [
  ...loginRoutes,
  ...adminRoutes
];



export const appRoutingProviders: any[] = [
	authProviders,
	CanDeactivateGuard
];

// export const appRoutingProviders: any[] = [];
// const appRoutes: Routes = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);

