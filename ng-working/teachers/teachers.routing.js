"use strict";
var router_1 = require('@angular/router');
var apply_teacher_component_1 = require('./apply-teacher.component');
exports.teachersRoutes = [
    { path: 'applyteacher', component: apply_teacher_component_1.ApplyTeacherComponent, pathMatch: 'prefix' }
];
exports.teachersRouting = router_1.RouterModule.forChild(exports.teachersRoutes);
//# sourceMappingURL=teachers.routing.js.map