import { Component, OnInit } from '@angular/core';
import { User } from './user';
import { UserService } from './user.service';

import { Router } from '@angular/router';

@Component({
	moduleId: module.id, // @required : relative path
    selector: 'my-users',
	templateUrl: 'users.component.html',
	styleUrls: [ 'users.component.css' ],
	providers: [UserService]
})
export class UsersComponent implements OnInit {

	users:User[];
	selectedUser: User;

  	constructor(
	    private router: Router,
	    private userService: UserService) { }	

	getUsers(): void {
		this.userService.getUsers().then(users => this.users = users);
		// Test poor internet connection
		// this.userService.getUsersSlowly().then(users => this.users = users);
	}

	ngOnInit(): void {
		this.getUsers();
	}

	onSelect(user: User): void {
		this.selectedUser = user;
	}

	gotoDetail(): void {
		this.router.navigate(['/detail', this.selectedUser.id]);
	}

	add(name: string): void {
		name = name.trim();
		if (!name) { return; }
		this.userService.create(name)
		.then(user => {
		  this.users.push(user);
		  this.selectedUser = null;
		});
	}

	delete(user: User): void {
		this.userService
		  .delete(user.id)
		  .then(() => {
		    this.users = this.users.filter(u => u !== user);
		    if (this.selectedUser === user) { this.selectedUser = null; }
		  });
	}
}
