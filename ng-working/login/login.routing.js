"use strict";
var auth_guard_service_1 = require('../auth/auth-guard.service');
var auth_service_1 = require('../auth/auth.service');
var login_component_1 = require('./login.component');
var kakao_callback_component_1 = require('./kakao/kakao-callback.component');
var naver_callback_component_1 = require('./naver/naver-callback.component');
var facebook_callback_component_1 = require('./facebook/facebook-callback.component');
exports.loginRoutes = [
    {
        path: 'login',
        component: login_component_1.LoginComponent,
        children: [
            {
                path: 'kakao',
                component: kakao_callback_component_1.KakaoCallbackComponent
            },
            {
                path: 'naver',
                component: naver_callback_component_1.NaverCallbackComponent
            },
            {
                path: 'facebook',
                component: facebook_callback_component_1.FacebookCallbackComponent
            }
        ]
    }
];
exports.authProviders = [
    auth_guard_service_1.AuthGuard,
    auth_service_1.AuthService
];
/*
Copyright 2016 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/ 
//# sourceMappingURL=login.routing.js.map