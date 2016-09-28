import { Component } from '@angular/core';

@Component({
	moduleId: module.id, // @required : relative path
	selector: 'my-app',
	styleUrls: ['app.component.css'],
	template: `
		<h1>{{title}}</h1>
		<nav>
			<a routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
			<a routerLink="/users" routerLinkActive="active">Users</a>
		</nav>
		<router-outlet></router-outlet>    
	`
})
export class AppComponent {
  title = 'user of cafeclass';
}
