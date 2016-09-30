import { Component } from '@angular/core';

// Add the RxJS Observable operators we need in this app.
import './rxjs-operators';

@Component({
	moduleId: module.id, // @required : relative path
	selector: 'my-app',
	styleUrls: ['app.component.css'],
	template: `
		<h1>{{title}}</h1>
		<nav>
			<a routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
			<a routerLink="/users" routerLinkActive="active">Users</a>
			<a routerLink="/userlist" routerLinkActive="active">UserList</a>
		</nav>
		<router-outlet></router-outlet>    
	`
})
export class AppComponent {
  title = 'user of cafeclass!!';
}
