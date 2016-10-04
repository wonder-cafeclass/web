import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClassCenterHomeComponent }    from './class-center-home.component';
import { ClassCenterComponent }    from './class-center.component';
import { ClassListComponent }    from './class-list.component';
import { ClassDetailComponent }  from './class-detail.component';

const classCenterRoutes: Routes = [
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
						component: ClassDetailComponent
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
