import { ModuleWithProviders }      	from '@angular/core';
import { Routes, RouterModule }     	from '@angular/router';

import { ApplyTeacherComponent }		from './apply-teacher.component';
import { ApplyTeacherTermComponent }	from './view/apply-teacher-term.component';

import { TeacherMyNavListComponent }    from './view/teacher-my-nav-list.component';


export const teachersRoutes: Routes = 
[
	{ path: 'applyteacher', component: ApplyTeacherComponent, pathMatch: 'full' },
	{ path: 'applyteacherterm', component: ApplyTeacherTermComponent, pathMatch: 'full' },
	{ path: 'my', component: TeacherMyNavListComponent, pathMatch: 'full' }
];

export const teachersRouting: ModuleWithProviders = RouterModule.forChild(teachersRoutes);