import './rxjs-extensions';

import { NgModule }       from '@angular/core';
import { FormsModule }    from '@angular/forms';
import { CommonModule }   from '@angular/common';

import { KlassService }              from './klass.service';
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
    KlassService,
    CClassSearchService,
    CClassDetailResolve
  ]
})
export class CClassCenterModule {}