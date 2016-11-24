"use strict";
var router_1 = require('@angular/router');
var policy_component_1 = require('./policy.component');
var private_info_component_1 = require('./private-info.component');
exports.policyRoutes = [
    { path: 'policy', component: policy_component_1.PolicyComponent },
    { path: 'private-info', component: private_info_component_1.PrivateInfoComponent }
];
exports.policyRouting = router_1.RouterModule.forChild(exports.policyRoutes);
//# sourceMappingURL=policy.routing.js.map