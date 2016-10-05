"use strict";
var router_1 = require('@angular/router');
var class_center_home_component_1 = require('./class-center-home.component');
var class_list_component_1 = require('./class-list.component');
var class_center_component_1 = require('./class-center.component');
var class_detail_component_1 = require('./class-detail.component');
var can_deactivate_guard_service_1 = require('../can-deactivate-guard.service');
var class_detail_resolve_service_1 = require('./class-detail-resolve.service');
var classCenterRoutes = [
    {
        path: '',
        redirectTo: '/class-center',
        pathMatch: 'full'
    },
    {
        path: 'class-center',
        component: class_center_component_1.ClassCenterComponent,
        children: [
            {
                path: '',
                component: class_list_component_1.ClassListComponent,
                children: [
                    {
                        path: ':id',
                        component: class_detail_component_1.ClassDetailComponent,
                        canDeactivate: [can_deactivate_guard_service_1.CanDeactivateGuard],
                        resolve: {
                            crisis: class_detail_resolve_service_1.ClassDetailResolve
                        }
                    },
                    {
                        path: '',
                        component: class_center_home_component_1.ClassCenterHomeComponent
                    }
                ]
            }
        ]
    }
];
exports.classCenterRouting = router_1.RouterModule.forChild(classCenterRoutes);
//# sourceMappingURL=class-center.routing.js.map