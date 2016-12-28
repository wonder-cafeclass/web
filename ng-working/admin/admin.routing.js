"use strict";
var router_1 = require('@angular/router');
var admin_component_1 = require('./admin.component');
var admin_dashboard_component_1 = require('./admin-dashboard.component');
var manage_crises_component_1 = require('./manage-crises.component');
var manage_heroes_component_1 = require('./manage-heroes.component');
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
                    { path: 'crises', component: manage_crises_component_1.ManageCrisesComponent },
                    { path: 'heroes', component: manage_heroes_component_1.ManageHeroesComponent },
                    { path: '', component: admin_dashboard_component_1.AdminDashboardComponent }
                ]
            }
        ]
    }
];
exports.adminRouting = router_1.RouterModule.forChild(adminRoutes);
//# sourceMappingURL=admin.routing.js.map