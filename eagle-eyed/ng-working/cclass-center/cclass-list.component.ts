import { Component, OnInit }      from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';

import { CClass, CClassService } from './cclass.service';

@Component({
  template: `
    <ul class="items">
      <li *ngFor="let cclass of crises"
        [class.selected]="isSelected(cclass)"
        (click)="onSelect(cclass)">
        <span class="badge">{{cclass.id}}</span> {{cclass.name}}
      </li>
    </ul>

    <router-outlet></router-outlet>
  `
})
export class CClassListComponent implements OnInit {
  crises: CClass[];
  public selectedId: number;

  constructor(
    private service: CClassService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  isSelected(cclass: CClass) {
    return cclass.id === this.selectedId;
  }

  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      this.selectedId = params['id'];
      this.service.getCrises()
        .then(crises => this.crises = crises);
    });
  }

  onSelect(cclass: CClass) {
    this.selectedId = cclass.id;

    // Navigate with relative link
    this.router.navigate([cclass.id], { relativeTo: this.route });
  }
}


/*
Copyright 2016 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/