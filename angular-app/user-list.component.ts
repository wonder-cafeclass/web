import { Component, OnInit } from '@angular/core';

import { UserService } from './user.service';
import { User } from './user';

@Component({
  moduleId: module.id, // @required : relative path
  selector: 'my-user-list',
  templateUrl: 'user-list.component.html'
})

export class UserListComponent implements OnInit {
  errorMessage: string;
  users: User[];
  mode = 'Observable';
  constructor (private userService: UserService) {}
  ngOnInit() { this.getUseres(); }
  // observable-based
  /*
  getUseres() {
    this.userService.getUsers()
                     .subscribe(
                       users => this.users = users,
                       error =>  this.errorMessage = <any>error);
  }
  */
  // promise-based
  getUseres() {
    this.userService.getUsers()
                     .then(
                       users => this.users = users,
                       error =>  this.errorMessage = <any>error);
  } 

  // observable-based
  /* 
  addUser (name: string) {
    if (!name) { return; }
    this.userService.addUser(name)
                     .subscribe(
                       user  => this.users.push(user),
                       error =>  this.errorMessage = <any>error);
  }
  */
  // promise-based
  addUser (name: string) {
    if (!name) { return; }
    this.userService.addUser(name)
                     .then(
                       user  => this.users.push(user),
                       error =>  this.errorMessage = <any>error);
  }

}
