// Keep the Input import for now, we'll remove it later:
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params }   from '@angular/router';
import { Location }                 from '@angular/common';

import { UserService } from './user.service';
import { User } from './user';

@Component({
	moduleId: module.id, // @required : relative path
	selector: 'my-user-detail',
	templateUrl: 'user-detail.component.html',
	styleUrls: [ 'user-detail.component.css' ]
})
export class UserDetailComponent implements OnInit {
	@Input() user: User;

	constructor(
		private userService: UserService,
		private route: ActivatedRoute,
		private location: Location
	) {}

	ngOnInit(): void {
		this.route.params.forEach((params: Params) => {
			let id = +params['id'];
			this.userService.getUser(id)
			.then(user => this.user = user);
		});
	}

	goBack(): void {
		this.location.back();
	}	

}
