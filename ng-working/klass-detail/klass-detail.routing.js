"use strict";
var router_1 = require('@angular/router');
var klass_detail_component_1 = require('./klass-detail.component');
var klassDetailRoutes = [
    {
        path: ':id',
        component: klass_detail_component_1.KlassDetailComponent
    }
];
exports.klassDetailRouting = router_1.RouterModule.forChild(klassDetailRoutes);
//# sourceMappingURL=klass-detail.routing.js.map