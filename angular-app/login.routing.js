"use strict";
var auth_guard_service_1 = require('./auth-guard.service');
var auth_service_1 = require('./auth.service');
var login_component_1 = require('./login.component');
exports.loginRoutes = [
    { path: 'login', component: login_component_1.LoginComponent }
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