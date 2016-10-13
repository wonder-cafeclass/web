import { Component } from '@angular/core';

// Add the RxJS Observable operators we need in this app.
import './rxjs-operators';

@Component({
	selector: 'my-app',
	styleUrls: ['angular-app/app.component.css'],
	template: `
		<h1>{{title}}</h1>
	`
})
export class AppComponent {
  title = 'CafeClass';

  // 		<h1>{{title}}</h1>
		// <nav>
		// 	<a routerLink="/class-center" routerLinkActive="active">Classes Center</a>
		// 	<a routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
		// 	<a routerLink="/users" routerLinkActive="active">Users</a>
		// 	<a routerLink="/admin" routerLinkActive="active">Admin</a>
		// 	<a routerLink="/login" routerLinkActive="active">Login</a>
		// </nav>
		// <router-outlet></router-outlet>    

}
