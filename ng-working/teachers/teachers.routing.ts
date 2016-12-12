import { ModuleWithProviders }      	from '@angular/core';
import { Routes, RouterModule }     	from '@angular/router';

import { ApplyTeacherComponent }		from './apply-teacher.component';
import { ApplyTeacherTermComponent }	from './view/apply-teacher-term.component';

export const teachersRoutes: Routes = 
[
	{ path: 'applyteacher', component: ApplyTeacherComponent, pathMatch: 'full' },
	{ path: 'applyteacherterm', component: ApplyTeacherTermComponent, pathMatch: 'full' }
];

export const teachersRouting: ModuleWithProviders = RouterModule.forChild(teachersRoutes);