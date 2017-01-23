import { ModuleWithProviders }      from '@angular/core';
import { Routes, RouterModule }     from '@angular/router';

import { KlassDetailComponent }     from './klass-detail.component';

const klassDetailRoutes: Routes = [
  {
    path: ':id',
    component: KlassDetailComponent
  }
];

export const klassDetailRouting: ModuleWithProviders = RouterModule.forChild(klassDetailRoutes);