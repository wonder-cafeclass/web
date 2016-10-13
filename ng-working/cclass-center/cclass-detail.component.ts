import { Component, OnInit, HostBinding,
         trigger, transition,
         animate, style, state }  from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { CClass }                 from './cclass';
import { DialogService }          from '../widget/dialog.service';

@Component({
  template: `
  <div *ngIf="cclass">
    <h3>"{{editTitle}}"</h3>
    <div>
      <label>Id: </label>{{cclass.id}}</div>
    <div>
      <label>Title: </label>
      <input [(ngModel)]="editTitle" placeholder="title"/>
    </div>
    <p>
      <button (click)="save()">Save</button>
      <button (click)="cancel()">Cancel</button>
    </p>
  </div>
  `,
  styles: ['input {width: 20em}'],
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
export class CClassDetailComponent implements OnInit {
  @HostBinding('@routeAnimation') get routeAnimation() {
    return true;
  }

  @HostBinding('style.display') get display() {
    return 'block';
  }

  @HostBinding('style.position') get position() {
    return 'absolute';
  }

  cclass: CClass;
  editTitle: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public dialogService: DialogService
  ) { }

  ngOnInit() {
    this.route.data.forEach((data: { cclass: CClass }) => {
      this.editTitle = data.cclass.title;
      this.cclass = data.cclass;
    });
  }

  cancel() {
    this.gotoCrises();
  }

  save() {
    this.cclass.title = this.editTitle;
    this.gotoCrises();
  }

  canDeactivate(): Promise<boolean> | boolean {
    // Allow synchronous navigation (`true`) if no cclass or the cclass is unchanged
    if (!this.cclass || this.cclass.title === this.editTitle) {
      return true;
    }
    // Otherwise ask the user with the dialog service and return its
    // promise which resolves to true or false when the user decides
    return this.dialogService.confirm('Discard changes?');
  }

  gotoCrises() {
    let cclassId = this.cclass ? this.cclass.id : null;
    // Pass along the cclass id if available
    // so that the CClassListComponent can select that cclass.
    // Add a totally useless `foo` parameter for kicks.
    // Relative navigation back to the crises
    this.router.navigate(['../', { id: cclassId, foo: 'foo' }], { relativeTo: this.route });
  }
}


/*
Copyright 2016 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/