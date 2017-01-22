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
var debug_btn_component_1 = require('./widget/debug/debug-btn.component');
var footer_component_1 = require('./widget/footer/footer.component');
var app_routing_1 = require('./app.routing');
var klass_center_module_1 = require('./klass/klass-center.module');
// import { WidgetModule }             from './widget/widget.module';
var shared_module_1 = require('./shared/shared.module');
var auth_service_1 = require('./auth.service');
var login_service_1 = require('./login/service/login.service');
var url_service_1 = require('./util/url.service');
var image_service_1 = require('./util/image.service');
var my_event_service_1 = require('./util/service/my-event.service');
var my_asset_service_1 = require('./util/my-asset.service');
var my_logger_service_1 = require('./util/service/my-logger.service');
var my_event_watchtower_service_1 = require('./util/service/my-event-watchtower.service');
var user_service_1 = require('./users/service/user.service');
var my_checker_service_1 = require('./util/service/my-checker.service');
// import { SafeHtmlPipe }             from './util/pipe/safe-html-pipe';
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
                klass_center_module_1.KlassCenterModule,
                // WidgetModule,
                shared_module_1.SharedModule,
                http_1.HttpModule,
                http_1.JsonpModule
            ],
            declarations: [
                app_component_1.AppComponent,
                debug_btn_component_1.DebugBtnComponent,
                footer_component_1.FooterComponent
            ],
            providers: [
                auth_service_1.AuthService,
                login_service_1.LoginService,
                url_service_1.UrlService,
                image_service_1.ImageService,
                my_event_service_1.MyEventService,
                my_asset_service_1.MyAssetService,
                my_logger_service_1.MyLoggerService,
                app_routing_1.appRoutingProviders,
                { provide: common_1.LocationStrategy, useClass: common_1.HashLocationStrategy },
                my_event_watchtower_service_1.MyEventWatchTowerService,
                user_service_1.UserService,
                my_checker_service_1.MyCheckerService
            ],
            bootstrap: [app_component_1.AppComponent]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map