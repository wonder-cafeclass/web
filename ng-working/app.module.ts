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

import { LoginComponent }             from './login/login.component';
import { KakaoCallbackComponent }     from './login/kakao/kakao-callback.component';
import { NaverCallbackComponent }     from './login/naver/naver-callback.component';
import { FacebookCallbackComponent }  from './login/facebook/facebook-callback.component';

import { DialogService }            from './widget/dialog.service';
import { AuthService }              from './auth.service';
import { LoginService }             from './login/service/login.service';
import { UrlService }               from './util/url.service';
import { ImageService }             from './util/image.service';
import { MyEventService }           from './util/my-event.service';
import { MyAssetService }           from './util/my-asset.service';




import './rxjs-extensions';
import './rxjs-operators';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    routing,
    UsersModule,
    KlassCenterModule,
    HttpModule,
    JsonpModule
  ],
  declarations: [
    AppComponent,
    LoginComponent,
    KakaoCallbackComponent,
    NaverCallbackComponent,
    FacebookCallbackComponent
  ],
  providers: [
    AuthService,
    LoginService,
    UrlService,
    ImageService,
    MyEventService,
    MyAssetService,
    appRoutingProviders,
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    DialogService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {
}