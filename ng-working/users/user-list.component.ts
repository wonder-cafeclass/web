// TODO SOMEDAY: Feature Componetized like CrisisCenter
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';


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
export class UserListComponent {

  private selectedId: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

}
