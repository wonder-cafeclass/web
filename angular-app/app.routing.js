"use strict";
var router_1 = require('@angular/router');
var login_routing_1 = require('./login.routing');
var can_deactivate_guard_service_1 = require('./can-deactivate-guard.service');
var adminRoutes = [
    {
        path: 'admin',
        loadChildren: 'app/admin/admin.module#AdminModule'
    }
];
var appRoutes = login_routing_1.loginRoutes.concat(adminRoutes);
exports.appRoutingProviders = [
    login_routing_1.authProviders,
    can_deactivate_guard_service_1.CanDeactivateGuard
];
// export const appRoutingProviders: any[] = [];
// const appRoutes: Routes = [];
exports.routing = router_1.RouterModule.forRoot(appRoutes);
//# sourceMappingURL=app.routing.js.map