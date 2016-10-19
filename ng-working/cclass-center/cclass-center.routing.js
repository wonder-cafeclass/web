"use strict";
var router_1 = require('@angular/router');
var cclass_center_home_component_1 = require('./cclass-center-home.component');
var klass_list_component_1 = require('./klass-list.component');
var cclass_center_component_1 = require('./cclass-center.component');
var cclass_detail_component_1 = require('./cclass-detail.component');
var can_deactivate_guard_service_1 = require('../guard/can-deactivate-guard.service');
var cclass_detail_resolve_service_1 = require('./cclass-detail-resolve.service');
var cclassCenterRoutes = [
    {
        path: '',
        redirectTo: '/cclass-center',
        pathMatch: 'full'
    },
    {
        path: 'cclass-center',
        component: cclass_center_component_1.CClassCenterComponent,
        children: [
            {
                path: '',
                component: klass_list_component_1.KlassListComponent,
                children: [
                    {
                        path: ':id',
                        component: cclass_detail_component_1.CClassDetailComponent,
                        canDeactivate: [can_deactivate_guard_service_1.CanDeactivateGuard],
                        resolve: {
                            cclass: cclass_detail_resolve_service_1.CClassDetailResolve
                        }
                    },
                    {
                        path: '',
                        component: cclass_center_home_component_1.CClassCenterHomeComponent
                    }
                ]
            }
        ]
    }
];
exports.cclassCenterRouting = router_1.RouterModule.forChild(cclassCenterRoutes);
/*
Copyright 2016 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/ 
//# sourceMappingURL=cclass-center.routing.js.map