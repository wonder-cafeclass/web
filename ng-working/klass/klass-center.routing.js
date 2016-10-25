"use strict";
var router_1 = require('@angular/router');
var klass_center_home_component_1 = require('./klass-center-home.component');
var klass_list_component_1 = require('./klass-list.component');
var klass_center_component_1 = require('./klass-center.component');
var klass_detail_component_1 = require('./klass-detail.component');
var can_deactivate_guard_service_1 = require('../guard/can-deactivate-guard.service');
var klass_detail_resolve_service_1 = require('./klass-detail-resolve.service');
var klassCenterRoutes = [
    {
        path: '',
        redirectTo: '/klass-center',
        pathMatch: 'full'
    },
    {
        path: 'klass-center',
        component: klass_center_component_1.KlassCenterComponent,
        children: [
            {
                path: '',
                component: klass_list_component_1.KlassListComponent,
                children: [
                    {
                        path: ':id',
                        component: klass_detail_component_1.KlassDetailComponent,
                        canDeactivate: [can_deactivate_guard_service_1.CanDeactivateGuard],
                        resolve: {
                            klass: klass_detail_resolve_service_1.KlassDetailResolve
                        }
                    },
                    {
                        path: '',
                        component: klass_center_home_component_1.KlassCenterHomeComponent
                    }
                ]
            }
        ]
    }
];
exports.klassCenterRouting = router_1.RouterModule.forChild(klassCenterRoutes);
//# sourceMappingURL=klass-center.routing.js.map