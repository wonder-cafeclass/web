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
var core_1 = require('@angular/core');
// Add the RxJS Observable operators we need in this app.
require('./rxjs-operators');
var AppComponent = (function () {
    function AppComponent() {
        this.title = 'user of cafeclass!!';
    }
    AppComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'my-app',
            styleUrls: ['app.component.css'],
            template: "\n\t\t<h1>{{title}}</h1>\n\t\t<nav>\n\t\t\t<a routerLink=\"/dashboard\" routerLinkActive=\"active\">Dashboard</a>\n\t\t\t<a routerLink=\"/users\" routerLinkActive=\"active\">Users</a>\n\t\t\t<a routerLink=\"/users\" routerLinkActive=\"active\">UserList</a>\n\t\t</nav>\n\t\t<router-outlet></router-outlet>    \n\t"
        }), 
        __metadata('design:paramtypes', [])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map