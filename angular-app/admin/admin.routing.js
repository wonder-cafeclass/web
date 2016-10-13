"use strict";
var router_1 = require('@angular/router');
var admin_component_1 = require('./admin.component');
var admin_dashboard_component_1 = require('./admin-dashboard.component');
var manage_users_component_1 = require('./manage-users.component');
var manage_classes_component_1 = require('./manage-classes.component');
var auth_guard_service_1 = require('../auth-guard.service');
var adminRoutes = [
    {
        path: 'admin',
        component: admin_component_1.AdminComponent,
        canActivate: [auth_guard_service_1.AuthGuard],
        children: [
            {
                path: '',
                canActivateChild: [auth_guard_service_1.AuthGuard],
                children: [
                    { path: 'classes', component: manage_classes_component_1.ManageClassesComponent },
                    { path: 'users', component: manage_users_component_1.ManageUsersComponent },
                    { path: '', component: admin_dashboard_component_1.AdminDashboardComponent }
                ]
            }
        ]
    }
];
exports.adminRouting = router_1.RouterModule.forChild(adminRoutes);
//# sourceMappingURL=admin.routing.js.map