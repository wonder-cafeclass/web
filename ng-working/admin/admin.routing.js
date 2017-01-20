"use strict";
var router_1 = require('@angular/router');
var admin_component_1 = require('./admin.component');
var admin_dashboard_component_1 = require('./admin-dashboard.component');
var manage_teachers_component_1 = require('./manage-teachers.component');
var manage_users_component_1 = require('./manage-users.component');
var manage_klasses_component_1 = require('./manage-klasses.component');
var manage_payments_component_1 = require('./manage-payments.component');
var auth_guard_service_1 = require('../auth/auth-guard.service');
var adminRoutes = [
    {
        path: '',
        component: admin_component_1.AdminComponent,
        canActivate: [auth_guard_service_1.AuthGuard],
        children: [
            {
                path: '',
                canActivateChild: [auth_guard_service_1.AuthGuard],
                children: [
                    { path: 'teachers', component: manage_teachers_component_1.ManageTeachersComponent },
                    { path: 'users', component: manage_users_component_1.ManageUsersComponent },
                    { path: 'klasses', component: manage_klasses_component_1.ManageKlassesComponent },
                    { path: 'payments', component: manage_payments_component_1.ManagePaymentsComponent },
                    { path: '', component: admin_dashboard_component_1.AdminDashboardComponent }
                ]
            }
        ]
    }
];
exports.adminRouting = router_1.RouterModule.forChild(adminRoutes);
//# sourceMappingURL=admin.routing.js.map