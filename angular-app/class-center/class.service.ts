export class Class {
  constructor(public id: number, public name: string) { }
}
const CLASS = [
  new Class(1, 'Dragon Burning Cities'),
  new Class(2, 'Sky Rains Great White Sharks'),
  new Class(3, 'Giant Asteroid Heading For Earth'),
  new Class(4, 'Procrastinators Meeting Delayed Again'),
];
let crisesPromise = Promise.resolve(CLASS);
import { Injectable } from '@angular/core';
@Injectable()
export class ClassService {
  static nextClassId = 100;
  getCrises() { return crisesPromise; }
  getClass(id: number | string) {
    return crisesPromise
      .then(crises => crises.find(crisis => crisis.id === +id));
  }
}
