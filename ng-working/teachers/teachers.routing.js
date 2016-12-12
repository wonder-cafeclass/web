"use strict";
var router_1 = require('@angular/router');
var apply_teacher_component_1 = require('./apply-teacher.component');
var apply_teacher_term_component_1 = require('./view/apply-teacher-term.component');
exports.teachersRoutes = [
    { path: 'applyteacher', component: apply_teacher_component_1.ApplyTeacherComponent, pathMatch: 'full' },
    { path: 'applyteacherterm', component: apply_teacher_term_component_1.ApplyTeacherTermComponent, pathMatch: 'full' }
];
exports.teachersRouting = router_1.RouterModule.forChild(exports.teachersRoutes);
//# sourceMappingURL=teachers.routing.js.map