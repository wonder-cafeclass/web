import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UsersComponent }		from './users.component';
import { DashboardComponent }	from './dashboard.component';

const appRoutes: Routes = [
	{
		path: 'users',
		component: UsersComponent
	},
	{
		path: 'dashboard',
		component: DashboardComponent
	},
	{
		path: '',
		redirectTo: '/dashboard',
		pathMatch: 'full'
	}
];

export const appRoutingProviders: any[] = [

];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);

