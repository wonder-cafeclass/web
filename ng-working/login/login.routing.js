"use strict";
var auth_guard_service_1 = require('../auth/auth-guard.service');
var auth_service_1 = require('../auth/auth.service');
var login_component_1 = require('./login.component');
var kakao_callback_component_1 = require('./kakao/kakao-callback.component');
var naver_callback_component_1 = require('./naver/naver-callback.component');
var facebook_callback_component_1 = require('./facebook/facebook-callback.component');
exports.loginRoutes = [
    { path: 'login', component: login_component_1.LoginComponent },
    { path: 'login/kakao', component: kakao_callback_component_1.KakaoCallbackComponent },
    { path: 'login/naver', component: naver_callback_component_1.NaverCallbackComponent },
    { path: 'login/facebook', component: facebook_callback_component_1.FacebookCallbackComponent }
];
exports.authProviders = [
    auth_guard_service_1.AuthGuard,
    auth_service_1.AuthService
];
//# sourceMappingURL=login.routing.js.map