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
var klass_center_module_1 = require('./klass/klass-center.module');
var widget_module_1 = require('./widget/widget.module');
var dialog_service_1 = require('./widget/dialog.service');
var auth_service_1 = require('./auth.service');
var url_service_1 = require('./util/url.service');
var my_event_service_1 = require('./util/service/my-event.service');
var my_asset_service_1 = require('./util/my-asset.service');
var my_logger_service_1 = require('./util/service/my-logger.service');
var upload_service_1 = require('./util/service/upload.service');
var my_event_watchtower_service_1 = require('./util/service/my-event-watchtower.service');
var user_service_1 = require('./users/service/user.service');
var my_checker_service_1 = require('./util/service/my-checker.service');
var default_service_1 = require('./widget/input/default/service/default.service');
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
                widget_module_1.WidgetModule,
                http_1.HttpModule,
                http_1.JsonpModule
            ],
            declarations: [
                app_component_1.AppComponent
            ],
            providers: [
                auth_service_1.AuthService,
                url_service_1.UrlService,
                my_event_service_1.MyEventService,
                my_asset_service_1.MyAssetService,
                my_logger_service_1.MyLoggerService,
                app_routing_1.appRoutingProviders,
                { provide: common_1.LocationStrategy, useClass: common_1.HashLocationStrategy },
                dialog_service_1.DialogService,
                upload_service_1.UploadService,
                my_event_watchtower_service_1.MyEventWatchTowerService,
                user_service_1.UserService,
                default_service_1.DefaultService,
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