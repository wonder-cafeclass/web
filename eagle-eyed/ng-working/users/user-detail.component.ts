import { Component, OnInit, HostBinding,
         trigger, transition, animate,
         style, state } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { User, UserService }  from './user.service';

@Component({
  template: `
  <h2>Users</h2>
  <div *ngIf="user">
    <h3>"{{user.name}}"</h3>
    <div>
      <label>Id: </label>{{user.id}}</div>
    <div>
      <label>Name: </label>
      <input [(ngModel)]="user.name" placeholder="name"/>
    </div>
    <p>
      <button (click)="gotoUsers()">Back</button>
    </p>
  </div>
  `,
  animations: [
    trigger('routeAnimation', [
      state('*',
        style({
          opacity: 1,
          transform: 'translateX(0)'
        })
      ),
      transition('void => *', [
        style({
          opacity: 0,
          transform: 'translateX(-100%)'
        }),
        animate('0.2s ease-in')
      ]),
      transition('* => void', [
        animate('0.5s ease-out', style({
          opacity: 0,
          transform: 'translateY(100%)'
        }))
      ])
    ])
  ]
})
export class UserDetailComponent implements OnInit {
  @HostBinding('@routeAnimation') get routeAnimation() {
    return true;
  }

  @HostBinding('style.display') get display() {
    return 'block';
  }

  @HostBinding('style.position') get position() {
    return 'absolute';
  }

  user: User;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: UserService) {}

  ngOnInit() {
    this.route.params.forEach((params: Params) => {
       let id = +params['id']; // (+) converts string 'id' to a number
       this.service.getUser(id).then(user => this.user = user);
     });
  }

  gotoUsers() {
    let userId = this.user ? this.user.id : null;
    // Pass along the user id if available
    // so that the userList component can select that user.
    this.router.navigate(['/users', { id: userId, foo: 'foo' }]);
  }
}


/*
Copyright 2016 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/