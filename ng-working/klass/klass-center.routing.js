"use strict";
var router_1 = require('@angular/router');
var klass_list_component_1 = require('./klass-list.component');
var klass_center_component_1 = require('./klass-center.component');
var klassCenterRoutes = [
    {
        path: '',
        redirectTo: '/class-center',
        pathMatch: 'full'
    },
    {
        path: 'class-center',
        component: klass_center_component_1.KlassCenterComponent,
        children: [
            {
                path: '',
                component: klass_list_component_1.KlassListComponent
            }
        ]
    }
];
exports.klassCenterRouting = router_1.RouterModule.forChild(klassCenterRoutes);
//# sourceMappingURL=klass-center.routing.js.map