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
var UserListComponent = (function () {
    function UserListComponent(route, router) {
        this.route = route;
        this.router = router;
    }
    UserListComponent = __decorate([
        core_1.Component({
            template: "\n    <h2>Users</h2>\n    <ul class=\"items\">\n      <li *ngFor=\"let user of users\"\n        [class.selected]=\"isSelected(user)\"\n        (click)=\"onSelect(user)\">\n        <span class=\"badge\">{{user.id}}</span> {{user.name}}\n      </li>\n    </ul>\n  "
        }), 
        __metadata('design:paramtypes', [router_1.ActivatedRoute, router_1.Router])
    ], UserListComponent);
    return UserListComponent;
}());
exports.UserListComponent = UserListComponent;
//# sourceMappingURL=user-list.component.js.map