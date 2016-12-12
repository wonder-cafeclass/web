import { ModuleWithProviders }      	from '@angular/core';
import { Routes, RouterModule }     	from '@angular/router';

import { ApplyTeacherComponent }		from './apply-teacher.component';

export const teachersRoutes: Routes = 
[
	{ path: 'applyteacher', component: ApplyTeacherComponent, pathMatch: 'prefix' }
];

export const teachersRouting: ModuleWithProviders = RouterModule.forChild(teachersRoutes);