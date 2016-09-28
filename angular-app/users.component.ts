import { Component, OnInit } from '@angular/core';
import { User } from './user';
import { UserService } from './user.service';

@Component({
	moduleId: module.id, // @required : relative path
    selector: 'my-users',
	styles: [`
		.selected {
			background-color: #CFD8DC !important;
			color: white;
		}
		.heroes {
			margin: 0 0 2em 0;
			list-style-type: none;
			padding: 0;
			width: 15em;
		}
		.heroes li {
			cursor: pointer;
			position: relative;
			left: 0;
			background-color: #EEE;
			margin: .5em;
			padding: .3em 0;
			height: 1.6em;
			border-radius: 4px;
		}
		.heroes li.selected:hover {
			background-color: #BBD8DC !important;
			color: white;
		}
		.heroes li:hover {
			color: #607D8B;
			background-color: #DDD;
			left: .1em;
		}
		.heroes .text {
			position: relative;
			top: -3px;
		}
		.heroes .badge {
			display: inline-block;
			font-size: small;
			color: white;
			padding: 0.8em 0.7em 0 0.7em;
			background-color: #607D8B;
			line-height: 1em;
			position: relative;
			left: -1px;
			top: -4px;
			height: 1.8em;
			margin-right: .8em;
			border-radius: 4px 0 0 4px;
		}
	`],    
	template:`
		<h2>Our users</h2>
		<ul class="heroes">
			<li *ngFor="let user of users" 
				[class.selected]="user === selectedUser"
				(click)="onSelect(user)">
				<span class="badge">{{user.id}}</span> {{user.name}}
			</li>
		</ul>
		<div *ngIf="selectedUser">
			<h2>
				{{selectedUser.name | uppercase}} is my user
			</h2>
			<button (click)="gotoDetail()">View Details</button>
		</div>
	`,
	providers: [UserService]
})
export class UsersComponent implements OnInit {
	title = 'User of Cafeclass';
	users:User[];
	selectedUser: User;

	constructor(private userService: UserService) { }

	onSelect(user: User): void {
		this.selectedUser = user;
	}

	ngOnInit(): void {
		this.getUsers();
	}

	getUsers(): void {
		this.userService.getUsers().then(users => this.users = users);
		// Test poor internet connection
		// this.userService.getUsersSlowly().then(users => this.users = users);
	}

}
