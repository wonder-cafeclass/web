import { NgModule }       from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { FormsModule }    from '@angular/forms';

import { AppComponent }         from './app.component';
import { routing,
         appRoutingProviders }  from './app.routing';

import { UsersModule }         from './users/users.module';
import { CClassCenterModule }   from './cclass-center/cclass-center.module';

import { LoginComponent }       from './login/login.component';
import { DialogService }        from './widget/dialog.service';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    routing,
    UsersModule,
    CClassCenterModule
  ],
  declarations: [
    AppComponent,
    LoginComponent
  ],
  providers: [
    appRoutingProviders,
    DialogService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {
}


/*
Copyright 2016 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/