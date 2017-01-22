import '../rxjs-extensions';
import '../rxjs-operators';

import { NgModule }                 	from '@angular/core';
import { CommonModule }             	from '@angular/common';
import { FormsModule }              	from '@angular/forms';

import { SafeHtmlPipe }                 from '../util/pipe/safe-html-pipe';

// @ Desc : Shared module.
@NgModule({
	imports: [
		CommonModule,
		FormsModule
	],
	declarations: [
		SafeHtmlPipe
	],
	exports: [ 
		SafeHtmlPipe
	],
	providers: [
	
	]
})
export class SharedModule {}