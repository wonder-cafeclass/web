import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { loginRoutes }      from './login/login.routing';

import { CanDeactivateGuard } from './guard/can-deactivate-guard.service';
import { AuthGuard }          from './auth/auth-guard.service';
import { AuthService }            from './auth/auth.service';

// REMOVE ME
/*
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
*/

const appRoutes: Routes = [
  {
    path: 'admin',
    loadChildren: 'app/admin/admin.module#AdminModule',
    canLoad: [AuthGuard]
  },
  // {
  //   path: 'applyteacher',
  //   loadChildren: 'app/teachers/teachers.module#TeachersModule'
  // },
  // {
  //   path: 'applyteacherterm',
  //   loadChildren: 'app/teachers/teachers.module#TeachersModule'
  // },  
  // {
  //   path: 'teacher/my',
  //   loadChildren: 'app/teachers/teachers.module#TeachersModule'
  // },  
  // {
  //   path: 'login',
  //   loadChildren: 'app/login/login.module#LoginModule'
  // },  
  // {
  //   path: 'logout',
  //   loadChildren: 'app/login/login.module#LoginModule'
  // },    
  // {
  //   path: 'policy',
  //   loadChildren: 'app/policy/policy.module#PolicyModule'
  // },    
  // {
  //   path: 'private-info',
  //   loadChildren: 'app/policy/policy.module#PolicyModule'
  // },      
  // {
  //   path: 'user',
  //   loadChildren: 'app/users/users.module#UsersModule'
  // },        
];


export const appRoutingProviders: any[] = [
  AuthGuard,
  AuthService,
  CanDeactivateGuard
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);