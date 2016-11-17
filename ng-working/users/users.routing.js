"use strict";
var router_1 = require('@angular/router');
var user_list_component_1 = require('./user-list.component');
var user_detail_component_1 = require('./user-detail.component');
var usersRoutes = [
    { path: 'users', component: user_list_component_1.UserListComponent },
    { path: 'user/:id', component: user_detail_component_1.UserDetailComponent }
];
exports.usersRouting = router_1.RouterModule.forChild(usersRoutes);
//# sourceMappingURL=users.routing.js.map