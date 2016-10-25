"use strict";
var router_1 = require('@angular/router');
var login_routing_1 = require('./login/login.routing');
var can_deactivate_guard_service_1 = require('./guard/can-deactivate-guard.service');
var auth_guard_service_1 = require('./auth/auth-guard.service');
var adminRoutes = [
    {
        path: 'admin',
        loadChildren: 'app/admin/admin.module#AdminModule',
        canLoad: [auth_guard_service_1.AuthGuard]
    }
];
var appRoutes = login_routing_1.loginRoutes.concat(adminRoutes);
exports.appRoutingProviders = [
    login_routing_1.authProviders,
    can_deactivate_guard_service_1.CanDeactivateGuard
];
exports.routing = router_1.RouterModule.forRoot(appRoutes);
//# sourceMappingURL=app.routing.js.map