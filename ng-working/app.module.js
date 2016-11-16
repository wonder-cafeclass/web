"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var platform_browser_1 = require('@angular/platform-browser');
var forms_1 = require('@angular/forms');
var http_1 = require('@angular/http');
var common_1 = require('@angular/common');
var app_component_1 = require('./app.component');
var app_routing_1 = require('./app.routing');
var users_module_1 = require('./users/users.module');
var klass_center_module_1 = require('./klass/klass-center.module');
var login_component_1 = require('./login/login.component');
var kakao_callback_component_1 = require('./login/kakao/kakao-callback.component');
var naver_callback_component_1 = require('./login/naver/naver-callback.component');
var facebook_callback_component_1 = require('./login/facebook/facebook-callback.component');
var dialog_service_1 = require('./widget/dialog.service');
var auth_service_1 = require('./auth.service');
var login_service_1 = require('./login/service/login.service');
var url_service_1 = require('./util/url.service');
var image_service_1 = require('./util/image.service');
var my_event_service_1 = require('./util/my-event.service');
var my_asset_service_1 = require('./util/my-asset.service');
require('./rxjs-extensions');
require('./rxjs-operators');
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            imports: [
                platform_browser_1.BrowserModule,
                forms_1.FormsModule,
                app_routing_1.routing,
                users_module_1.UsersModule,
                klass_center_module_1.KlassCenterModule,
                http_1.HttpModule,
                http_1.JsonpModule
            ],
            declarations: [
                app_component_1.AppComponent,
                login_component_1.LoginComponent,
                kakao_callback_component_1.KakaoCallbackComponent,
                naver_callback_component_1.NaverCallbackComponent,
                facebook_callback_component_1.FacebookCallbackComponent
            ],
            providers: [
                auth_service_1.AuthService,
                login_service_1.LoginService,
                url_service_1.UrlService,
                image_service_1.ImageService,
                my_event_service_1.MyEventService,
                my_asset_service_1.MyAssetService,
                app_routing_1.appRoutingProviders,
                { provide: common_1.LocationStrategy, useClass: common_1.HashLocationStrategy },
                dialog_service_1.DialogService
            ],
            bootstrap: [app_component_1.AppComponent]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map