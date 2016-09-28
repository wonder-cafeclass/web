import { Component, OnInit } from '@angular/core';

import { User } from './user';
import { UserService } from './user.service';

@Component({
	moduleId: module.id, // @required : relative path
	selector: 'my-dashboard',
	templateUrl: 'dashboard.component.html'
})
export class DashboardComponent implements OnInit {

  useres: User[] = [];

  constructor(private userService: UserService) { }

  ngOnInit(): void {
	this.userService.getUsers()
	  .then(useres => this.useres = useres.slice(1, 5));
  }

  gotoDetail(user: User): void { /* not implemented yet */}
}

