import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { loginRoutes,
         authProviders }      from './login/login.routing';

import { CanDeactivateGuard } from './guard/can-deactivate-guard.service';
import { AuthGuard }          from './auth/auth-guard.service';

const adminRoutes: Routes = [
  {
    path: 'admin',
    loadChildren: 'app/admin/admin.module#AdminModule',
    canLoad: [AuthGuard]
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

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);