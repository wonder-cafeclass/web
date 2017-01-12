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
var common_1 = require('@angular/common');
var forms_1 = require('@angular/forms');
var widget_module_1 = require('../widget/widget.module');
var user_my_component_1 = require('./user-my.component');
var user_my_nav_list_component_1 = require('./user-my-nav-list.component');
var my_info_component_1 = require('./view/user-my-nav-list/my-info.component');
var my_info_dashboard_component_1 = require('./view/user-my-nav-list/my-info-dashboard.component');
var klass_radiobtn_service_1 = require('../klass/service/klass-radiobtn.service');
var users_routing_1 = require('./users.routing');
var UsersModule = (function () {
    function UsersModule() {
    }
    UsersModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule,
                forms_1.FormsModule,
                widget_module_1.WidgetModule,
                users_routing_1.usersRouting
            ],
            declarations: [
                user_my_component_1.UserMyComponent,
                user_my_nav_list_component_1.UserMyNavListComponent,
                my_info_component_1.MyInfoComponent,
                my_info_dashboard_component_1.MyInfoDashboardComponent
            ],
            providers: [
                klass_radiobtn_service_1.KlassRadioBtnService
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], UsersModule);
    return UsersModule;
}());
exports.UsersModule = UsersModule;
//# sourceMappingURL=users.module.js.map