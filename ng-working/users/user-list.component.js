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
// TODO SOMEDAY: Feature Componetized like CrisisCenter
var core_1 = require('@angular/core');
var router_1 = require('@angular/router');
var user_service_1 = require('./user.service');
var UserListComponent = (function () {
    function UserListComponent(service, route, router) {
        this.service = service;
        this.route = route;
        this.router = router;
    }
    UserListComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.route.params.forEach(function (params) {
            _this.selectedId = +params['id'];
            _this.service.getUsers()
                .then(function (users) { return _this.users = users; });
        });
    };
    UserListComponent.prototype.isSelected = function (user) { return user.id === this.selectedId; };
    UserListComponent.prototype.onSelect = function (user) {
        this.router.navigate(['/user', user.id]);
    };
    UserListComponent = __decorate([
        core_1.Component({
            template: "\n    <h2>Users</h2>\n    <ul class=\"items\">\n      <li *ngFor=\"let user of users\"\n        [class.selected]=\"isSelected(user)\"\n        (click)=\"onSelect(user)\">\n        <span class=\"badge\">{{user.id}}</span> {{user.name}}\n      </li>\n    </ul>\n  "
        }), 
        __metadata('design:paramtypes', [user_service_1.UserService, router_1.ActivatedRoute, router_1.Router])
    ], UserListComponent);
    return UserListComponent;
}());
exports.UserListComponent = UserListComponent;
/*
Copyright 2016 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/ 
//# sourceMappingURL=user-list.component.js.map