import '../rxjs-extensions';
import '../rxjs-operators';

import { NgModule }                 from '@angular/core';
import { CommonModule }             from '@angular/common';
import { FormsModule }              from '@angular/forms';

import { NavTabsComponent }         from './nav-tabs/nav-tabs.component';

// @ Desc : Shared module.
@NgModule({
	imports: [
		CommonModule,
		FormsModule
	],
	declarations: [
		NavTabsComponent
	],
	exports: [ 
		NavTabsComponent,
		CommonModule, 
		FormsModule 
	]
})
export class WidgetModule {}