import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UsersComponent }		from './users.component';
import { UserDetailComponent }	from './user-detail.component';
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
		path: 'detail/:id',
		component: UserDetailComponent
	},
	{
		path: '',
		redirectTo: '/dashboard',
		pathMatch: 'full'
	},
	{
		path: 'cafeclass',
		component: DashboardComponent
	}	

];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);

