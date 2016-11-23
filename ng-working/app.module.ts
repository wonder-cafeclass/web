import { NgModule }       from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { FormsModule }    from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import { LocationStrategy, HashLocationStrategy, PlatformLocation } from '@angular/common';

import { AppComponent }             from './app.component';
import { routing,
         appRoutingProviders }      from './app.routing';

import { UsersModule }              from './users/users.module';
import { KlassCenterModule }        from './klass/klass-center.module';
import { LoginModule }              from './login/login.module';

import { DialogService }            from './widget/dialog.service';
import { AuthService }              from './auth.service';
import { LoginService }             from './login/service/login.service';
import { UrlService }               from './util/url.service';
import { ImageService }             from './util/image.service';
import { MyEventService }           from './util/service/my-event.service';
import { MyAssetService }           from './util/my-asset.service';
import { MyLoggerService }          from './util/service/my-logger.service';
import { UploadService }          from './util/service/upload.service';

import './rxjs-extensions';
import './rxjs-operators';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    routing,
    UsersModule,
    KlassCenterModule,
    LoginModule,
    HttpModule,
    JsonpModule
  ],
  declarations: [
    AppComponent
  ],
  providers: [
    AuthService,
    LoginService,
    UrlService,
    ImageService,
    MyEventService,
    MyAssetService,
    MyLoggerService,
    appRoutingProviders,
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    DialogService,
    UploadService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {
}