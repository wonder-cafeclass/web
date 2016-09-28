import { Component, OnInit } from '@angular/core';

import { User } from './user';
import { UserService } from './user.service';

import { Router } from '@angular/router';

@Component({
	moduleId: module.id, // @required : relative path
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
		  .then(users => this.users = users.slice(1, 5));
	}

	gotoDetail(user: User): void {
		let link = ['/detail', user.id];
		this.router.navigate(link);
	}

}

