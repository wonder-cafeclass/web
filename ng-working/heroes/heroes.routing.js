"use strict";
var router_1 = require('@angular/router');
var hero_list_component_1 = require('./hero-list.component');
var hero_detail_component_1 = require('./hero-detail.component');
var heroesRoutes = [
    { path: 'heroes', component: hero_list_component_1.HeroListComponent },
    { path: 'hero/:id', component: hero_detail_component_1.HeroDetailComponent }
];
exports.heroesRouting = router_1.RouterModule.forChild(heroesRoutes);
/*
Copyright 2016 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/ 
//# sourceMappingURL=heroes.routing.js.map