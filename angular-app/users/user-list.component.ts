import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { UserService } from './user.service';
import { User } from './user';

@Component({
  // moduleId: module.id, // @required : relative path
  selector: 'my-user-list',
  templateUrl: 'user-list.component.html'
})

export class UserListComponent implements OnInit {
  errorMessage: string;
  users: User[];
  mode = 'Observable';

  private selectedId: number;

  constructor (
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  ngOnInit() { 
    // Legacy
    // this.getUsers(); 

    // New
    this.route.params.forEach((params: Params) => {
      this.selectedId = +params['id'];
      this.userService.getUsers()
        .then(users => this.users = users);
    });    
  }

  isSelected(user: User) { return user.id === this.selectedId; }

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
  getUsers() {
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

  onSelect(user: User) {
    this.router.navigate(['/user', user.id]);
  }  

}
