import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { loginRoutes }      from './login/login.routing';

import { CanDeactivateGuard } from './guard/can-deactivate-guard.service';
import { AuthGuard }          from './auth/auth-guard.service';
import { AuthService }            from './auth/auth.service';

const adminRoutes: Routes = [
  {
    path: 'admin',
    loadChildren: 'app/admin/admin.module#AdminModule',
    canLoad: [AuthGuard]
  }
];

const appRoutes: Routes = [
  ...adminRoutes
];

export const appRoutingProviders: any[] = [
  AuthGuard,
  AuthService,
  CanDeactivateGuard
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);