"use strict";
var router_1 = require('@angular/router');
var users_component_1 = require('./users.component');
var user_detail_component_1 = require('./user-detail.component');
var user_list_component_1 = require('./user-list.component');
var dashboard_component_1 = require('./dashboard.component');
var appRoutes = [
    {
        path: 'users',
        component: users_component_1.UsersComponent
    },
    {
        path: 'userlist',
        component: user_list_component_1.UserListComponent
    },
    {
        path: 'dashboard',
        component: dashboard_component_1.DashboardComponent
    },
    {
        path: 'detail/:id',
        component: user_detail_component_1.UserDetailComponent
    },
    {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full'
    }
];
exports.routing = router_1.RouterModule.forRoot(appRoutes);
//# sourceMappingURL=app.routing.js.map