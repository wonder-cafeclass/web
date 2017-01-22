import { NgModule }                 from '@angular/core';
import { BrowserModule }            from '@angular/platform-browser';
import { FormsModule }              from '@angular/forms';
import { HttpModule, 
         JsonpModule }              from '@angular/http';
import { LocationStrategy, 
         HashLocationStrategy, 
         PlatformLocation }         from '@angular/common';

import { AppComponent }             from './app.component';
import { DebugBtnComponent }        from './widget/debug/debug-btn.component';
import { FooterComponent }          from './widget/footer/footer.component';
import { routing,
         appRoutingProviders }      from './app.routing';

import { KlassCenterModule }        from './klass/klass-center.module';
// import { WidgetModule }             from './widget/widget.module';
import { SharedModule }             from './shared/shared.module';

import { AuthService }              from './auth.service';
import { LoginService }             from './login/service/login.service';
import { UrlService }               from './util/url.service';
import { ImageService }             from './util/image.service';
import { MyEventService }           from './util/service/my-event.service';
import { MyAssetService }           from './util/my-asset.service';
import { MyLoggerService }          from './util/service/my-logger.service';
import { MyEventWatchTowerService } from './util/service/my-event-watchtower.service';
import { UserService }              from './users/service/user.service';
import { MyCheckerService }         from './util/service/my-checker.service';
// import { SafeHtmlPipe }             from './util/pipe/safe-html-pipe';

import './rxjs-extensions';
import './rxjs-operators';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    routing,
    KlassCenterModule,
    // WidgetModule,
    SharedModule,
    HttpModule,
    JsonpModule
  ],
  declarations: [
    AppComponent,
    DebugBtnComponent,
    FooterComponent
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
    MyEventWatchTowerService,
    UserService,
    MyCheckerService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {}