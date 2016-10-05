"use strict";
var router_1 = require('@angular/router');
var crisis_center_home_component_1 = require('./crisis-center-home.component');
var crisis_list_component_1 = require('./crisis-list.component');
var crisis_center_component_1 = require('./crisis-center.component');
var crisis_detail_component_1 = require('./crisis-detail.component');
var can_deactivate_guard_service_1 = require('../guard/can-deactivate-guard.service');
var crisis_detail_resolve_service_1 = require('./crisis-detail-resolve.service');
var crisisCenterRoutes = [
    {
        path: '',
        redirectTo: '/crisis-center',
        pathMatch: 'full'
    },
    {
        path: 'crisis-center',
        component: crisis_center_component_1.CrisisCenterComponent,
        children: [
            {
                path: '',
                component: crisis_list_component_1.CrisisListComponent,
                children: [
                    {
                        path: ':id',
                        component: crisis_detail_component_1.CrisisDetailComponent,
                        canDeactivate: [can_deactivate_guard_service_1.CanDeactivateGuard],
                        resolve: {
                            crisis: crisis_detail_resolve_service_1.CrisisDetailResolve
                        }
                    },
                    {
                        path: '',
                        component: crisis_center_home_component_1.CrisisCenterHomeComponent
                    }
                ]
            }
        ]
    }
];
exports.crisisCenterRouting = router_1.RouterModule.forChild(crisisCenterRoutes);
/*
Copyright 2016 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/ 
//# sourceMappingURL=crisis-center.routing.js.map