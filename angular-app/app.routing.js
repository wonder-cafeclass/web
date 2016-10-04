"use strict";
var router_1 = require('@angular/router');
var users_component_1 = require('./users.component');
var dashboard_component_1 = require('./dashboard.component');
var appRoutes = [
    {
        path: 'users',
        component: users_component_1.UsersComponent
    },
    {
        path: 'dashboard',
        component: dashboard_component_1.DashboardComponent
    },
    {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full'
    }
];
exports.appRoutingProviders = [];
exports.routing = router_1.RouterModule.forRoot(appRoutes);
//# sourceMappingURL=app.routing.js.map