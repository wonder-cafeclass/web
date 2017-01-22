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
require('../rxjs-extensions');
var core_1 = require('@angular/core');
var forms_1 = require('@angular/forms');
var common_1 = require('@angular/common');
var widget_module_1 = require('../widget/widget.module');
var login_routing_1 = require('./login.routing');
var login_component_1 = require('./login.component');
var logout_component_1 = require('./logout/logout.component');
var facebook_callback_component_1 = require('./facebook/facebook-callback.component');
var kakao_callback_component_1 = require('./kakao/kakao-callback.component');
var naver_callback_component_1 = require('./naver/naver-callback.component');
var signup_component_1 = require('./signup/signup.component');
var signup_select_component_1 = require('./signup/signup-select.component');
var validation_component_1 = require('./validation/validation.component');
var login_service_1 = require('./service/login.service');
var user_service_1 = require('../users/service/user.service');
var my_birthday_service_1 = require('../util/service/my-birthday.service');
var my_checker_service_1 = require('../util/service/my-checker.service');
var LoginModule = (function () {
    function LoginModule() {
    }
    LoginModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule,
                forms_1.FormsModule,
                widget_module_1.WidgetModule,
                login_routing_1.loginRouting
            ],
            declarations: [
                login_component_1.LoginComponent,
                logout_component_1.LogoutComponent,
                facebook_callback_component_1.FacebookCallbackComponent,
                kakao_callback_component_1.KakaoCallbackComponent,
                naver_callback_component_1.NaverCallbackComponent,
                signup_component_1.SignupComponent,
                signup_select_component_1.SignupSelectComponent,
                validation_component_1.ValidationComponent
            ],
            providers: [
                login_service_1.LoginService,
                user_service_1.UserService,
                my_birthday_service_1.MyBirthdayService,
                my_checker_service_1.MyCheckerService
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], LoginModule);
    return LoginModule;
}());
exports.LoginModule = LoginModule;
//# sourceMappingURL=login.module.js.map