import { Component } from '@angular/core';

@Component({
	moduleId: module.id, // @required : relative path
	template:  `
		<h2>CLASS CENTER</h2>
		<router-outlet></router-outlet>
	`
})
export class ClassCenterComponent { }
