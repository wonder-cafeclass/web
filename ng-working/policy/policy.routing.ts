import { ModuleWithProviders }      from '@angular/core';
import { Routes, RouterModule }     from '@angular/router';

import { PolicyComponent } 			from './policy.component';
import { PrivateInfoComponent } 	from './private-info.component';

export const policyRoutes: Routes = 
[
	{ path: '', component: PolicyComponent },
	{ path: 'private-info', component: PrivateInfoComponent }
];

export const policyRouting: ModuleWithProviders = RouterModule.forChild(policyRoutes);