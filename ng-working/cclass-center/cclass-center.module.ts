import { NgModule }       from '@angular/core';
import { FormsModule }    from '@angular/forms';
import { CommonModule }   from '@angular/common';

import { CClassService }              from './cclass.service';
import { CClassSearchService }        from './cclass-search.service';
import { CClassDetailResolve }        from './cclass-detail-resolve.service';

import { CClassCenterComponent }     from './cclass-center.component';
import { CClassListComponent }       from './cclass-list.component';
import { CClassCenterHomeComponent } from './cclass-center-home.component';
import { CClassDetailComponent }     from './cclass-detail.component';

import { cclassCenterRouting } from './cclass-center.routing';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    cclassCenterRouting
  ],
  declarations: [
    CClassCenterComponent,
    CClassListComponent,
    CClassCenterHomeComponent,
    CClassDetailComponent
  ],

  providers: [
    CClassService,
    CClassSearchService,
    CClassDetailResolve
  ]
})
export class CClassCenterModule {}


/*
Copyright 2016 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/