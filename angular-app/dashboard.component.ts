import { Component, OnInit } from '@angular/core';

import { User } from './users/user';
import { UserService } from './users/user.service';

import { Router } from '@angular/router';

@Component({
	// moduleId: module.id, // @required : relative path
	selector: 'my-dashboard',
	templateUrl: 'dashboard.component.html',
	styleUrls: [ 'dashboard.component.css' ]

})
export class DashboardComponent implements OnInit {

	users: User[] = [];

	constructor(
		private router: Router,
		private userService: UserService) {
	}
	
	ngOnInit(): void {
		this.userService.getUsers()
		  // .then(users => this.users = users.slice(1, 5));
		  .then(users => this.users = users);
	}

	gotoDetail(user: User): void {
		// let link = ['/detail', user.id];
		let link = ['/user', user.id];
		this.router.navigate(link);
	}

}

