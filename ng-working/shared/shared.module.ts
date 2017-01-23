import '../rxjs-extensions';
import '../rxjs-operators';

import { NgModule }                 	from '@angular/core';
import { CommonModule }             	from '@angular/common';
import { FormsModule }              	from '@angular/forms';

import { DebugBtnComponent }        	from '../widget/debug/debug-btn.component';

import { SafeHtmlPipe }                 from '../util/pipe/safe-html-pipe';

// @ Desc : Shared module.
@NgModule({
	imports: [
		CommonModule,
		FormsModule
	],
	declarations: [
		DebugBtnComponent,
		SafeHtmlPipe
	],
	exports: [ 
		DebugBtnComponent,
		SafeHtmlPipe
	],
	providers: [
	
	]
})
export class SharedModule {}