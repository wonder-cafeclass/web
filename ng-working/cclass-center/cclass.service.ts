export class CClass {
  constructor(public id: number, public name: string) { }
}

const CRISES = [
  new CClass(1, 'Dragon Burning Cities'),
  new CClass(2, 'Sky Rains Great White Sharks'),
  new CClass(3, 'Giant Asteroid Heading For Earth'),
  new CClass(4, 'Procrastinators Meeting Delayed Again'),
];

let cclassesPromise = Promise.resolve(CRISES);

import { Injectable } from '@angular/core';

@Injectable()
export class CClassService {

  static nextCClassId = 100;

  getCrises() { return cclassesPromise; }

  getCClass(id: number | string) {
    return cclassesPromise
      .then(cclasses => cclasses.find(cclass => cclass.id === +id));
  }


  addCClass(name: string) {
    name = name.trim();
    if (name) {
      let cclass = new CClass(CClassService.nextCClassId++, name);
      cclassesPromise.then(cclasses => cclasses.push(cclass));
    }
  }
}


/*
Copyright 2016 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/