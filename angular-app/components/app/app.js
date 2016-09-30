"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("angular2/core");
var component_1 = require("../users/component");
var component_2 = require("../movies/component");
var login_component_1 = require("../login/login.component");
var router_1 = require('angular2/router');
var App = (function () {
    function App() {
    }
    App = __decorate([
        router_1.RouteConfig([
            { path: '/users', name: 'Users', component: component_1.Users },
            { path: '/movies', name: 'Movies', component: component_2.Movies },
            { path: '/login', name: 'Login', component: login_component_1.Login },
            { path: '/', name: 'root', redirectTo: ['/Users'] }
        ]),
        core_1.Component({
            selector: "angular2-codeigniter",
            template: '<router-outlet></router-outlet>',
            directives: [router_1.ROUTER_DIRECTIVES]
        }), 
        __metadata('design:paramtypes', [])
    ], App);
    return App;
}());
exports.App = App;
//# sourceMappingURL=app.js.map