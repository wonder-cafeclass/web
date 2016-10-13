// TODO SOMEDAY: Feature Componetized like CrisisCenter
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { User, UserService }  from './user.service';

@Component({
  template: `
    <h2>Users</h2>
    <ul class="items">
      <li *ngFor="let user of users"
        [class.selected]="isSelected(user)"
        (click)="onSelect(user)">
        <span class="badge">{{user.id}}</span> {{user.name}}
      </li>
    </ul>
  `
})
export class UserListComponent implements OnInit {
  users: User[];

  private selectedId: number;

  constructor(
    private service: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.forEach((params: Params) => {
        this.selectedId = +params['id'];
        this.service.getUsers()
          .then(users => this.users = users);
      });
  }

  isSelected(user: User) { return user.id === this.selectedId; }

  onSelect(user: User) {
    this.router.navigate(['/user', user.id]);
  }

}


/*
Copyright 2016 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/