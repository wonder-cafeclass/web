"use strict";
var router_1 = require('@angular/router');
var can_deactivate_guard_service_1 = require('./guard/can-deactivate-guard.service');
var auth_guard_service_1 = require('./auth/auth-guard.service');
var auth_service_1 = require('./auth/auth.service');
// REMOVE ME
/*
const adminRoutes: Routes = [
  {
    path: 'admin',
    loadChildren: 'app/admin/admin.module#AdminModule',
    canLoad: [AuthGuard]
  }
];
const appRoutes: Routes = [
  ...adminRoutes
];
*/
var appRoutes = [
    {
        path: 'admin',
        loadChildren: 'app/admin/admin.module#AdminModule',
        canLoad: [auth_guard_service_1.AuthGuard]
    },
];
exports.appRoutingProviders = [
    auth_guard_service_1.AuthGuard,
    auth_service_1.AuthService,
    can_deactivate_guard_service_1.CanDeactivateGuard
];
exports.routing = router_1.RouterModule.forRoot(appRoutes);
//# sourceMappingURL=app.routing.js.map