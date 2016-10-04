"use strict";
var router_1 = require('@angular/router');
var class_center_home_component_1 = require('./class-center-home.component');
var class_center_component_1 = require('./class-center.component');
var class_list_component_1 = require('./class-list.component');
var class_detail_component_1 = require('./class-detail.component');
var classCenterRoutes = [
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
                        component: class_detail_component_1.ClassDetailComponent
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