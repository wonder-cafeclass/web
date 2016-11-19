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
var login_routing_1 = require('./login.routing');
var login_component_1 = require('./login.component');
var facebook_callback_component_1 = require('./facebook/facebook-callback.component');
var kakao_callback_component_1 = require('./kakao/kakao-callback.component');
var naver_callback_component_1 = require('./naver/naver-callback.component');
var signup_component_1 = require('./signup/signup.component');
var email_component_1 = require('./signup/email/email.component');
var password_component_1 = require('./signup/password/password.component');
var name_component_1 = require('./signup/name/name.component');
var phone_number_component_1 = require('./signup/phone-number/phone-number.component');
var profile_img_upload_component_1 = require('./signup/profile-img-upload/profile-img-upload.component');
var nickname_component_1 = require('./signup/nickname/nickname.component');
var gender_component_1 = require('./signup/gender/gender.component');
var birthday_component_1 = require('./signup/birthday/birthday.component');
var login_service_1 = require('./service/login.service');
var my_birthday_service_1 = require('../util/service/my-birthday.service');
var LoginModule = (function () {
    function LoginModule() {
    }
    LoginModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule,
                forms_1.FormsModule,
                login_routing_1.loginRouting
            ],
            declarations: [
                login_component_1.LoginComponent,
                facebook_callback_component_1.FacebookCallbackComponent,
                kakao_callback_component_1.KakaoCallbackComponent,
                naver_callback_component_1.NaverCallbackComponent,
                signup_component_1.SignupComponent,
                email_component_1.EmailComponent,
                password_component_1.PasswordComponent,
                name_component_1.NameComponent,
                phone_number_component_1.PhoneNumberComponent,
                profile_img_upload_component_1.ProfileImgUploadComponent,
                nickname_component_1.NicknameComponent,
                gender_component_1.GenderComponent,
                birthday_component_1.BirthdayComponent
            ],
            providers: [
                login_service_1.LoginService,
                my_birthday_service_1.MyBirthdayService
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], LoginModule);
    return LoginModule;
}());
exports.LoginModule = LoginModule;
//# sourceMappingURL=login.module.js.map