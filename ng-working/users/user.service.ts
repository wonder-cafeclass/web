import { Injectable } from '@angular/core';

export class User {
  constructor(public id: number, public name: string) { }
}

let USERS = [
  new User(11, 'Mr. Nice'),
  new User(12, 'Narco'),
  new User(13, 'Bombasto'),
  new User(14, 'Celeritas'),
  new User(15, 'Magneta'),
  new User(16, 'RubberMan')
];

let usersPromise = Promise.resolve(USERS);

@Injectable()
export class UserService {
  getUsers() { return usersPromise; }

  getUser(id: number | string) {
    return usersPromise
      .then(users => users.find(user => user.id === +id));
  }
}


/*
Copyright 2016 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/