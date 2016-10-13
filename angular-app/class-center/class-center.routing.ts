import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClassCenterHomeComponent }    from './class-center-home.component';
import { ClassListComponent }    from './class-list.component';
import { ClassCenterComponent }    from './class-center.component';
import { ClassDetailComponent }  from './class-detail.component';

import { CanDeactivateGuard }    from '../can-deactivate-guard.service';

import { ClassDetailResolve }   from './class-detail-resolve.service';

const classCenterRoutes: Routes = [
	{
		path: '',
		redirectTo: '/class-center',
		pathMatch: 'full'
	},
	{
		path: 'class-center',
		component: ClassCenterComponent,
		children: [
			{
				path: '',
				component: ClassListComponent,
				children: [
					{
						path: ':id',
						component: ClassDetailComponent,
						canDeactivate: [CanDeactivateGuard],
			            resolve: {
							crisis: ClassDetailResolve
			            }						
					},
					{
						path: '',
						component: ClassCenterHomeComponent
					}
				]
			}
		]
	}
];

export const classCenterRouting: ModuleWithProviders = RouterModule.forChild(classCenterRoutes);
