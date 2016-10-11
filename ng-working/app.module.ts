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

import { HttpModule, JsonpModule } from '@angular/http';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    routing,
    UsersModule,
    CClassCenterModule,
    HttpModule,
    JsonpModule
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